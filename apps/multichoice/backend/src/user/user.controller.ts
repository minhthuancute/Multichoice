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
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResultUserDto, UserExamDto } from '@monorepo/multichoice/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { SucessResponse } from '../model/SucessResponse';

@ApiTags('Exam')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/exam/end')
  async endExam(@Body() resultUserDto: ResultUserDto, @Res() res) {
    const result = await this.userService.endExam(resultUserDto);
    return res.status(200).json(result);
  }

  @Post('/exam/start')
  async startExam(@Res() res, @Body() resultUserDto: UserExamDto) {
    const result = await this.userService.startExam(resultUserDto);
    return res.status(200).json(result);
  }

  @Get(':url')
  async findTopicByUrl(@Param('url') url: string, @Res() res) {
    const result = await this.userService.findTopicByUrl(url);
    return res.status(200).json(result);
  }
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get('/getlistexambytopicid/:id')
  async getListExamByTopicID(@Param('id') id: number, @Res() res, @Req() req) {
    const result = await this.userService.getUserExamByTopic(id, req.user);
    return res.status(200).json(result);
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get('/userexam/getdetail')
  async test(
    @Query('topicID') topicID: number,
    @Query('userID') userID: number,
    @Res() res,
    @Req() req
  ) {
    const result = await this.userService.getUserExamdetail(
      topicID,
      userID,
      req.user
    );
    return res.status(200).json(result);
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Delete('/userexam/deletebyid')
  async deleteUserExamByID(
    @Query('id') id: number,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    return res
      .status(200)
      .json(await this.userService.deleteUserExamByID(id, req.user));
  }
}
