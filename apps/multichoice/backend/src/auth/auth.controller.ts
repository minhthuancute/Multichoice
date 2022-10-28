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

@ApiTags('auth')
@Controller('auth')
export class authController {
  constructor(private readonly authService: authService) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar' }], multerOptions))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() file
  ): Promise<any> {
    return this.authService.create(createUserDto, file);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() login: LoginUserDto,
    @Req() req,
    @Res() res
  ): Promise<any> {
    return res.status(200).json(new SucessResponse(200, req.user));
  }

  @Patch('/changepassword')
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  async changePassword(
    @Req() req,
    @Res() res,
    @Body() changePasswordDto: UpdateUserPasswordDto
  ): Promise<boolean> {
    const result = await this.authService.changePassword(
      req.user.id,
      changePasswordDto
    );
    return res.status(200).json(new SucessResponse(200, result));
  }

  @Post('/forgotpassword')
  async forgotPassword(
    @Query() forgotPasswordDto: ForgotPasswordDto,
    @Res() res
  ): Promise<void> {
    return res
      .status(200)
      .json(
        new SucessResponse(
          200,
          await this.authService.forgotPassword(forgotPasswordDto)
        )
      );
  }

  @Post('/resetpassword')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res
  ): Promise<void> {
    return res
      .status(200)
      .json(
        new SucessResponse(
          200,
          await this.authService.resetPassword(resetPasswordDto)
        )
      );
  }
}
