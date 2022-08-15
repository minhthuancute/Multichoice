import { CreateTopicDto } from '@monorepo/multichoice/dto';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { get } from 'https';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { SucessResponse } from '../model/SucessResponse';
import { Topic } from '../question/entities/topic.entity';
import { TopicService } from './topic.service';

@ApiTags('topic')
@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) { }
  @UseGuards(AuthenticationGuard)
  @Post('create')
  async create(@Body() topic: CreateTopicDto, @Req() req, @Res() res): Promise<SucessResponse> {
    const result = await this.topicService.create(topic, req.user);
    return res.status(200).json(result)
  }

  @Get('test')
  async test(@Res() res): Promise<Topic> {
    const result = await this.topicService.fineOneByID(1)
    return res.status(200).json(result)
  }
}
