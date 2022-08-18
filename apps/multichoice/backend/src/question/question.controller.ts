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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionDto } from '@monorepo/multichoice/dto';
import { ApiTags } from '@nestjs/swagger';
import { SucessResponse } from '../model/SucessResponse';
import { TopicService } from '../topic/topic.service';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { multerOptions } from '../uploads/upload';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService,
    private readonly topicService: TopicService) { }

  @UseGuards(AuthenticationGuard)
  @Post('create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }, { name: 'audio' }], multerOptions))
  async create(@Body() createQuestionDto: CreateQuestionDto, @UploadedFiles() files, @Res() res): Promise<SucessResponse> {
    const topic = await this.topicService.fineOneByID(createQuestionDto.topicID);
    if (!topic) throw new BadRequestException('topicid is not found')

    const result = await this.questionService.create(createQuestionDto, topic, files);
    return res.status(201).json(result)
  }
}
