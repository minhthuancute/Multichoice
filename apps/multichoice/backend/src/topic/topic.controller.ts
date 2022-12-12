import {
  AddGroupForTopic,
  CreateTopicDto,
  PageOptionsDto,
  QueryTopicDto,
} from '@monorepo/multichoice/dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { GConfig } from '../config/gconfig';
import { SucessResponse } from '../model/SucessResponse';
import { UserService } from '../user/user.service';
import { TopicService } from './topic.service';

@ApiTags('topic')
@Controller('topic')
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly userService: UserService
  ) {}
  @UseGuards(AuthenticationGuard)
  @Post('create')
  @ApiBearerAuth()
  async create(
    @Body() topic: CreateTopicDto,
    @Req() req,
    @Res() res
  ): Promise<SucessResponse> {
    const result = await this.topicService.create(topic, req.user.id);
    return res.status(201).json(new SucessResponse(201, result));
  }

  @Get('url')
  async findTopicByUrl(
    @Query('q') q: string,
    @Res() res
  ): Promise<SucessResponse> {
    console.log(q);
    const result = await this.topicService.findTopicByUrl(q);
    return res.json(new SucessResponse(200, result));
  }

  @UseGuards(AuthenticationGuard)
  @Get('/')
  @ApiBearerAuth()
  async getTopicAll(
    @Query() queryTopicDto: QueryTopicDto,
    @Req() req,
    @Res() res
  ): Promise<SucessResponse> {
    const result = await this.topicService.findAllTopics(
      queryTopicDto,
      req.user.id
    );
    return res.json(new SucessResponse(200, result));
  }

  @Get('public')
  async getTopicPublic(
    @Query() queryTopicDto: QueryTopicDto,
    @Res() res
  ): Promise<SucessResponse> {
    const result = await this.topicService.getTopicPublic(queryTopicDto);
    return res.json(new SucessResponse(200, result));
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getTopicById(
    @Param('id') id: number,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    const result = await this.topicService.getTopicByIdAndUserId(
      id,
      req.user.id
    );

    return res.json(new SucessResponse(200, result));
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get(':id/exams')
  async getListExamByTopicID(
    @Param('id') id: number,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    const result = await this.topicService.getUserExamByTopic(id, req.user.id);
    return res.json(new SucessResponse(200, result));
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  @ApiBearerAuth()
  async deleteTopicById(
    @Param('id') id: number,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    await this.topicService.deleteById(id, req.user.id);
    return res.json(new SucessResponse(200, GConfig.DELETE_MES_SUCESS));
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() topic: CreateTopicDto,
    @Req() req,
    @Res() res
  ): Promise<SucessResponse> {
    await this.topicService.update(id, topic, req.user.id);
    return res.json(new SucessResponse(200, GConfig.UPDATE_MES_SUCESS));
  }

  @UseGuards(AuthenticationGuard)
  @Post('group')
  @ApiBearerAuth()
  async addGroupForTopic(
    @Body() query: AddGroupForTopic,
    @Req() req,
    @Res() res
  ): Promise<SucessResponse> {
    await this.topicService.addGroupForTopic(query, req.user.id);
    return res.json(new SucessResponse(200, GConfig.ADD_MES_SUCESS));
  }
}
