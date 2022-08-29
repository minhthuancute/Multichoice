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
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { User } from './entities/user.entity';
import { TopicService } from '../topic/topic.service';
import { UserExam } from './entities/userExam';
import { url } from 'inspector';

@ApiTags('User')
@Controller()
// @UseGuards(AuthenticationGuard)
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
