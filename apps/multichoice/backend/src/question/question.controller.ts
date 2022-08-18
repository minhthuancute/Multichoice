import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionDto } from '@monorepo/multichoice/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SucessResponse } from '../model/SucessResponse';
import { TopicService } from '../topic/topic.service';
import { AuthenticationGuard } from '../auth/guards/auth.guard';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly topicService: TopicService
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('create')
  @ApiBearerAuth()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Res() res
  ): Promise<SucessResponse> {
    const topic = await this.topicService.fineOneByID(
      createQuestionDto.topicID
    );
    if (!topic) throw new BadRequestException('Topic is not found');

    const result = await this.questionService.create(createQuestionDto, topic);
    return res.status(201).json(result);
  }
}
