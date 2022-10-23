import { Injectable } from '@nestjs/common';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserTokenDto } from './dto/create-token.dto';
@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>
  ) {}

  async create(createUserTokenDto: CreateUserTokenDto): Promise<Token> {
    return await this.tokenRepository.save(createUserTokenDto);
  }

  async delete(email: string, token: string): Promise<void> {
    await this.tokenRepository.delete({ email, token });
  }
}
