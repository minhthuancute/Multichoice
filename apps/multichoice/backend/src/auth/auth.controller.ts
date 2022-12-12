import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Query,
} from '@nestjs/common';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
  UpdateUserPasswordDto,
} from '@monorepo/multichoice/dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { authService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { SucessResponse } from '../model/SucessResponse';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../uploads/upload';
import { AuthenticationGuard } from './guards/auth.guard';
import { GConfig } from '../config/gconfig';

@ApiTags('auth')
@Controller('auth')
export class authController {
  constructor(private readonly authService: authService) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar' }], multerOptions))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() file,
    @Res() res
  ): Promise<SucessResponse> {
    await this.authService.create(createUserDto, file);
    return res
      .status(201)
      .json(new SucessResponse(201, GConfig.ADD_MES_SUCESS));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() login: LoginUserDto,
    @Req() req,
    @Res() res
  ): Promise<SucessResponse> {
    return res.json(new SucessResponse(200, req.user));
  }

  @Patch('/change-password')
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  async changePassword(
    @Req() req,
    @Res() res,
    @Body() changePasswordDto: UpdateUserPasswordDto
  ): Promise<SucessResponse> {
    await this.authService.changePassword(req.user.id, changePasswordDto);
    return res.json(new SucessResponse(200, GConfig.UPDATE_MES_SUCESS));
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res
  ): Promise<SucessResponse> {
    await this.authService.forgotPassword(forgotPasswordDto);
    return res.json(new SucessResponse(200, GConfig.EMAIL_CHECK));
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res
  ): Promise<SucessResponse> {
    await this.authService.resetPassword(resetPasswordDto);
    return res.json(new SucessResponse(200, GConfig.RESET_MES_SUCESS));
  }
}
