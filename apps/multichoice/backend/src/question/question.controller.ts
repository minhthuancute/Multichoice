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
import { CreateQuestionDto } from '@monorepo/multichoice/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SucessResponse } from '../model/SucessResponse';
import { TopicService } from '../topic/topic.service';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { multerOptions } from '../uploads/upload';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly topicService: TopicService
  ) {}

  // @UseGuards(AuthenticationGuard)
  @Post('create')
  // @ApiBearerAuth()
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
}
