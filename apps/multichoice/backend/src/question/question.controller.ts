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
import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from '@monorepo/multichoice/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SucessResponse } from '../model/SucessResponse';
import { TopicService } from '../topic/topic.service';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { multerOptions } from '../uploads/upload';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateAnswerDto } from '../answer/dto/update-answer.dto';
import { Question } from './entities/question.entity';
import { plainToClass } from 'class-transformer';

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
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image' }, { name: 'audio' }], multerOptions)
  )
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @UploadedFiles() files,
    @Res() res
  ): Promise<SucessResponse> {
    const topic = await this.topicService.fineOneByID(
      createQuestionDto.topicID
    );
    if (!topic) throw new BadRequestException('topicid is not found');

    const result = await this.questionService.create(
      createQuestionDto,
      topic,
      files
    );
    return res.status(201).json(result);
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async deleteByID(@Param('id') id: number, @Res() res) {
    await this.questionService.deleteByID(id);
    return res.status(200).json(new SucessResponse(200, {}));
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findByID(@Param('id') id: number, @Res() res) {
    const result = await this.questionService.getQestionByID(id);
    return res.status(200).json(new SucessResponse(200, { result }));
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image' }, { name: 'audio' }], multerOptions)
  )
  async update(
    @Param('id') id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @UploadedFiles() files,
    @Res() res
  ): Promise<SucessResponse> {
    const result = await this.questionService.update(
      id,
      updateQuestionDto,
      files
    );
    return res.status(200).json(result);
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get('iscorrect/:id')
  async getQestionIsCorreectByID(@Param('id') id: number, @Res() res) {
    const result = await this.questionService.getQestionIsCorrectByID(id);
    return res.status(200).json(new SucessResponse(200, { result }));
  }
}
