import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  Query,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ResultUserDto,
  UpdateUserDto,
  UserExamDto,
} from '@monorepo/multichoice/dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { SucessResponse } from '../model/SucessResponse';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../uploads/upload';
import { GConfig } from '../config/gconfig';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/exam/end')
  async endExam(
    @Body() resultUserDto: ResultUserDto,
    @Res() res
  ): Promise<SucessResponse> {
    const result = await this.userService.endExam(resultUserDto);
    return res.status(200).json(new SucessResponse(200, result));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/exam/start')
  async startExam(
    @Res() res,
    @Req() req,
    @Body() resultUserDto: UserExamDto
  ): Promise<SucessResponse> {
    const result = await this.userService.startExam(resultUserDto, req.user);
    return res.status(200).json(new SucessResponse(200, result));
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get('/exam/detail')
  async test(
    @Query('topicID') topicID: number,
    @Query('userID') userID: number,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    const result = await this.userService.getUserExamDetail(
      topicID,
      userID,
      req.user.id
    );
    return res.json(new SucessResponse(200, result));
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Delete('/exam/:id')
  async deleteUserExamByID(
    @Param('id') id: number,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    await this.userService.deleteUserExamByID(id, req.user.id);
    return res.json(new SucessResponse(200, GConfig.DELETE_MES_SUCESS));
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Patch('/user')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar' }], multerOptions))
  async updateUserByID(
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
    @Req() req,
    @UploadedFiles() file
  ): Promise<SucessResponse> {
    await this.userService.updateUserByID(updateUserDto, file, req.user.id);
    return res.json(new SucessResponse(200, GConfig.UPDATE_MES_SUCESS));
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Post('/exam-realtime/end')
  async endExamRealTime(
    @Body() resultUserRealTimeDto: ResultUserDto,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    const result = await this.userService.endExamRealTime(
      resultUserRealTimeDto,
      req.user
    );
    return res.status(200).json(new SucessResponse(200, result));
  }
}
