import {
    Controller,
    Post,
    Body,
    Res,
    Get,
    UnauthorizedException,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto, } from '@monorepo/multichoice/dto';
import { ApiTags } from '@nestjs/swagger';
import { authService } from './auth.service';
import { Response, Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { SucessResponse } from '../model/SucessResponse';

@ApiTags('auth')
@Controller('auth')
export class authController {
    constructor(private readonly authService: authService) { }

    @Post('register')
    async create(@Body() createUserDto: CreateUserDto): Promise<any> {

        return this.authService.create(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() login: LoginUserDto, @Req() req, @Res() response): Promise<any> {
        return response.status(200).json(new SucessResponse(200, req.user))
    }

}
