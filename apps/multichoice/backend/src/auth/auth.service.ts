import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
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

    if (file && file.avatar !== undefined) {
      user.avatar = file.avatar[0].filename;
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({
      email,
    });
  }

  async create(createUserDto: CreateUserDto, file: any): Promise<User> {
    const user = await this.getUserByEmail(createUserDto.email);
    if (user) {
      throw new HttpException(
        { message: GConfig.EMAIL_ALREADY_EXISTS },
        HttpStatus.BAD_REQUEST
      );
    }

    return this.userRepository.save(
      await this.convertUserEntity(createUserDto, file)
    );
  }

  async validateUser(login: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOneBy({ email: login.email });
    if (!user) {
      throw new BadRequestException(GConfig.EMAIL_NOT_FOUND);
    }
    const isMatchPassword = await bcrypt.compare(login.password, user.password);
    if (!isMatchPassword) {
      throw new BadRequestException(GConfig.PASSWORD_IS_INCORRECT);
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

  async changePassword(
    userId: number,
    changePasswordDto: UpdateUserPasswordDto
  ): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) throw new BadRequestException(GConfig.USER_NOT_FOUND);

    const isMatchPassword = await bcrypt.compare(
      changePasswordDto.password,
      user.password
    );
    if (!isMatchPassword) {
      throw new BadRequestException(GConfig.PASSWORD_OLD_IS_INCORRECT);
    }
    const password = await bcrypt.hash(
      changePasswordDto.newPassword,
      this.saltRounds
    );
    await this.userRepository.update(userId, { password });

    return true;
  }

  private generateToken(): string {
    const token = crypto.randomBytes(30).toString('hex');
    //hash token roi luu vao db
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return hashedToken;
  }

  async signUser(user: User): Promise<string> {
    const token = await this.generateToken();

    // luu token len redis ( luu 5 phut)
    this.redisService.set(token, user.email, 300);

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
      to: 'hungdiep147@gmail.com',
      subject: 'Forgot Password',
      html: `
                <h3>Hello ${user.username}!</h3>
               <p>Vui lòng sử dụng liên kết này <a href="${forgotLink}">link</a> để đặt lại mật khẩu của bạn.
               Có hiệu lực trong 5 phút</p>
               `,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    if (
      resetPasswordDto.token === undefined ||
      resetPasswordDto.password === undefined
    )
      return;
    const email: string = await this.redisService.get(resetPasswordDto.token);
    if (!email) throw new BadRequestException(GConfig.EXPRIED_EMAIL_LINK);

    this.redisService.delete(resetPasswordDto.token);

    const user = await this.getUserByEmail(email);
    if (!user) throw new BadRequestException(GConfig.USER_NOT_FOUND);

    const password = await bcrypt.hash(
      resetPasswordDto.password,
      this.saltRounds
    );
    await this.userRepository.update(user.id, { password });
  }
}
