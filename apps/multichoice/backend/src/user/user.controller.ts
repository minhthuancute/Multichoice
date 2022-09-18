import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  ResultUserDto,
  UpdateUserDto,
  UserExamDto,
} from '@monorepo/multichoice/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { User } from './entities/user.entity';
import { TopicService } from '../topic/topic.service';
import { UserExam } from './entities/userExam';
import { url } from 'inspector';

@ApiTags('Exam')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly topicService: TopicService
  ) {}

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
}
