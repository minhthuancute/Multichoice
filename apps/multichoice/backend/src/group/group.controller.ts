import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  Res,
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
  create(@Body() createGroupDto: CreateGroupDto, @Req() req, @Res() res) {
    this.groupService.create(createGroupDto, req.user);
    return res
      .status(201)
      .json(new SucessResponse(201, GConfig.ADD_MES_SUCESS));
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get('getallgroup')
  async findAll(
    @Query() pageDto: PageOptionsDto,
    @Req() req,
    @Res() res
  ): Promise<SucessResponse> {
    return res
      .status(200)
      .json(
        new SucessResponse(
          200,
          await this.groupService.findAllGroup(pageDto, req.user)
        )
      );
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get('getbygroupid')
  async findOnebyGroupID(
    @Query('groupID') groupID: number,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    return res
      .status(200)
      .json(
        new SucessResponse(
          200,
          await this.groupService.getGroupDetail(groupID, req.user.id)
        )
      );
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Post('adduserforgroup')
  async addUserForGroup(
    @Body() addUserForGroupDto: AddUserGroupDto,
    @Res() res,
    @Req() req
  ): Promise<SucessResponse> {
    await this.groupService.addUserForGroup(addUserForGroupDto, req.user);
    return res
      .status(200)
      .json(new SucessResponse(200, GConfig.ADD_MES_SUCESS));
  }
}
