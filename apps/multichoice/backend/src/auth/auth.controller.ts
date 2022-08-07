import {
    Controller,
    Post,
    Body,
    Res,
    Get,
    UnauthorizedException,
    Req,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto, } from '@monorepo/multichoice/dto';
import { ApiTags } from '@nestjs/swagger';
import { authService } from './auth.servise';
import { Response, Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class authController {
    constructor(private readonly authService: authService) { }

    @Post('register')
    async create(@Body() createUserDto: CreateUserDto): Promise<any> {

        return this.authService.create(createUserDto);
    }

    @Post('login')
    async login(@Body() login: LoginUserDto, @Res({ passthrough: true }) response: Response): Promise<any> {

        return this.authService.findOne(login)
    }
}
