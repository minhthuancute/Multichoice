import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
  UpdateUserPasswordDto,
} from '@monorepo/multichoice/dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './interfaces/auth-payload.interface';
import { GConfig } from '../config/gconfig';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import * as crypto from 'crypto';
import configuration from '../config/configuration';

@Injectable()
export class authService {
  private readonly saltRounds = 12;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
    private redisService: RedisService
  ) {}

  async convertUserEntity(
    createUserDto: CreateUserDto,
    file: any
  ): Promise<User> {
    const user: User = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, this.saltRounds);

    if (file && file.avatar) {
      user.avatar = file.avatar[0].filename;
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({
      email,
    });
  }

  async create(createUserDto: CreateUserDto, file: any): Promise<void> {
    const user = await this.getUserByEmail(createUserDto.email);
    if (user) {
      throw new HttpException(
        { message: GConfig.EMAIL_ALREADY_EXISTS },
        HttpStatus.BAD_REQUEST
      );
    }

    this.userRepository.save(await this.convertUserEntity(createUserDto, file));
  }

  private async comparePassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  async validateUser(login: LoginUserDto): Promise<User> {
    const user = await this.getUserByEmail(login.email);
    if (user && !(await this.comparePassword(login.password, user.password))) {
      throw new BadRequestException(GConfig.LOGIN_ERROR);
    }
    return user;
  }

  async login(user: User) {
    const payload: AuthPayload = {
      username: user.username,
      email: user.email,
      id: user.id,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      payload,
    };
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  private async updatePasswordByUserId(
    userId: number,
    password: string
  ): Promise<void> {
    const passwordHash = await bcrypt.hash(password, this.saltRounds);
    await this.userRepository.update(userId, { password: passwordHash });
  }

  async changePassword(
    userId: number,
    changePasswordDto: UpdateUserPasswordDto
  ): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) throw new BadRequestException(GConfig.USER_NOT_FOUND);

    if (
      !(await this.comparePassword(changePasswordDto.password, user.password))
    ) {
      throw new BadRequestException(GConfig.PASSWORD_OLD_IS_INCORRECT);
    }

    await this.updatePasswordByUserId(userId, changePasswordDto.newPassword);
  }

  private generateToken(): string {
    const token = crypto.randomBytes(30).toString('hex');
    //hash token roi luu vao db
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return hashedToken;
  }

  async signUser(user: User): Promise<string> {
    const token = this.generateToken();

    // luu token len redis ( luu 5 phut)
    await this.redisService.set(token, user.email, GConfig.EXPRIED_TOKEN_REDIS);

    return token;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.getUserByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException(GConfig.USER_NOT_FOUND);
    }
    const token = await this.signUser(user);

    const forgotLink = `${
      configuration().fe_app_url
    }/auth/forgotPassword?token=${token}`;

    this.mailService.send({
      to: forgotPasswordDto.email,
      subject: 'Forgot Password',
      html: `
                <h3>Hello ${user.username}!</h3>
               <p>Vui lòng sử dụng liên kết này <a href="${forgotLink}">link</a> để đặt lại mật khẩu của bạn.
               Có hiệu lực trong 5 phút</p>
               `,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    if (!resetPasswordDto.token || !resetPasswordDto.password) return;
    const email: string = await this.redisService.get(resetPasswordDto.token);
    if (!email) throw new BadRequestException(GConfig.EXPRIED_EMAIL_LINK);

    this.redisService.delete(resetPasswordDto.token);

    const user = await this.getUserByEmail(email);
    if (!user) throw new BadRequestException(GConfig.USER_NOT_FOUND);

    await this.updatePasswordByUserId(user.id, resetPasswordDto.password);
  }

  verifyToken(token: string): AuthPayload {
    if (!token) throw new BadRequestException(GConfig.TOKEN_NOT_EMPTY);
    try {
      const user: User = this.jwtService.verify(token);
      const payload: AuthPayload = {
        username: user.username,
        id: user.id,
      };
      return payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
