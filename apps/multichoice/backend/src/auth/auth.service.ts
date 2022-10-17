import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserPasswordDto,
} from '@monorepo/multichoice/dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './interfaces/auth-payload.interface';
import { GConfig } from '../config/gconfig';

@Injectable()
export class authService {
  private readonly saltRounds = 12;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
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

  async create(createUserDto: CreateUserDto, file: any): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
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
}
