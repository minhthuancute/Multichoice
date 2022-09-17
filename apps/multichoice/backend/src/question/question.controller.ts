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
  Req,
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

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

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
    const result = await this.questionService.create(createQuestionDto, files);
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
  async findByID(@Param('id') id: number, @Res() res, @Req() req) {
    const result = await this.questionService.getQestionByID(id, req.user);
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
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    const result = await this.questionService.update(
      id,
      updateQuestionDto,
      files,
      req.user
    );
    return res.status(200).json(result);
  }
}
