import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  Res,
  Param,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  AddUserGroupDto,
  CreateGroupDto,
  PageOptionsDto,
} from '@monorepo/multichoice/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { SucessResponse } from '../model/SucessResponse';
import { GConfig } from '../config/gconfig';

@Controller('group')
@ApiTags('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Post('create')
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req,
    @Res() res
  ): Promise<SucessResponse> {
    await this.groupService.create(createGroupDto, req.user.id);
    return res
      .status(201)
      .json(new SucessResponse(201, GConfig.ADD_MES_SUCESS));
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get('/')
  async findAll(
    @Query() pageDto: PageOptionsDto,
    @Req() req,
    @Res() res
  ): Promise<SucessResponse> {
    return res.json(
      new SucessResponse(
        200,
        await this.groupService.findAllGroup(pageDto, req.user.id)
      )
    );
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOnebyGroupID(
    @Param('id') id: number,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    return res.json(
      new SucessResponse(
        200,
        await this.groupService.getGroupDetail(id, req.user.id)
      )
    );
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Post('user')
  async addUserForGroup(
    @Body() addUserForGroupDto: AddUserGroupDto,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    await this.groupService.addUserForGroup(addUserForGroupDto, req.user.id);
    return res.json(new SucessResponse(200, GConfig.ADD_MES_SUCESS));
  }
}
