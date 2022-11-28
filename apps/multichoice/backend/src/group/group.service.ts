import {
  AddUserGroupDto,
  CreateGroupDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from '@monorepo/multichoice/dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authService } from '../auth/auth.service';
import { GConfig } from '../config/gconfig';
import { User } from '../user/entities/user.entity';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private authService: authService
  ) {}

  private convertGroupDtoToGroupEntity(
    createGroupDto: CreateGroupDto,
    userID: number
  ): Group {
    const group = new Group();
    const user = new User(userID);
    if (!createGroupDto.name || !createGroupDto.name.length)
      throw new BadRequestException(GConfig.NAME_NOT_FOUND);
    group.name = createGroupDto.name.trim();
    group.owner = user;
    group.users = [user];
    return group;
  }
  public async create(
    createGroupDto: CreateGroupDto,
    userID: number
  ): Promise<void> {
    await this.groupRepository.save(
      this.convertGroupDtoToGroupEntity(createGroupDto, userID)
    );
  }

  public async findAllGroup(
    pageOptionsDto: PageOptionsDto,
    userID: number
  ): Promise<PageDto<Group>> {
    const queryBuilder = this.groupRepository
      .createQueryBuilder('group')
      .where('group.ownerId = :owner', { owner: userID })
      .leftJoin('group.users', 'users')
      .loadRelationCountAndMap('topic.usersCount', 'group.users')
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.take)
      .take(pageOptionsDto.take);
    const { 0: topics, 1: itemCount } = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(topics, pageMetaDto);
  }

  public async findOnebyGroupID(
    groupID: number,
    userID: number
  ): Promise<Group> {
    const result = await this.groupRepository.findOne({
      where: { id: groupID, owner: { id: userID } },
      relations: ['users'],
      select: {
        id: true,
        name: true,
        users: {
          username: true,
          id: true,
          avatar: true,
        },
      },
    });
    return result;
  }
  public async getGroupDetail(groupID: number, userID: number): Promise<Group> {
    const group = await this.findOnebyGroupID(groupID, userID);
    if (!group) throw new BadRequestException(GConfig.NOT_PERMISSION_VIEW);
    return group;
  }

  public async addUserForGroup(
    addUserForGroupDto: AddUserGroupDto,
    userID: number
  ): Promise<void> {
    const group = await this.getGroupDetail(addUserForGroupDto.groupID, userID);

    const addUser = await this.authService.getUserByEmail(
      addUserForGroupDto.email
    );
    if (!addUser) throw new BadRequestException(GConfig.USER_NOT_FOUND);

    group.users.push(addUser);
    await this.groupRepository.save(group);
  }
}
