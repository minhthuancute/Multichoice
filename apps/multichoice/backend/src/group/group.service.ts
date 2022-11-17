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
    user: User
  ): Group {
    const group = new Group();

    if (createGroupDto.name === undefined || createGroupDto.name.length === 0)
      throw new BadRequestException(GConfig.NAME_NOT_FOUND);
    group.name = createGroupDto.name.trim();
    group.owner = user;
    group.users = [user];
    return group;
  }
  create(createGroupDto: CreateGroupDto, user: User) {
    this.groupRepository.save(
      this.convertGroupDtoToGroupEntity(createGroupDto, user)
    );
  }

  async findAllGroup(
    pageOptionsDto: PageOptionsDto,
    user: User
  ): Promise<PageDto<Group>> {
    const queryBuilder = this.groupRepository
      .createQueryBuilder('group')
      .where('group.ownerId = :owner', { owner: user.id })
      .leftJoin('group.users', 'users')
      .loadRelationCountAndMap('topic.usersCount', 'group.users')
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.take)
      .take(pageOptionsDto.take);
    const { 0: topics, 1: itemCount } = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(topics, pageMetaDto);
  }

  async findOnebyGroupID(groupID: number, userID: number): Promise<Group> {
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
  async getGroupDetail(groupID: number, userID: number): Promise<Group> {
    const group = await this.findOnebyGroupID(groupID, userID);
    if (!group)
      throw new BadRequestException(GConfig.NOT_PERMISSION_ADD_USER_FOR_GROUP);
    return group;
  }

  async addUserForGroup(
    addUserForGroupDto: AddUserGroupDto,
    user: User
  ): Promise<void> {
    const group = await this.getGroupDetail(
      addUserForGroupDto.groupID,
      user.id
    );

    const addUser = await this.authService.getUserByEmail(
      addUserForGroupDto.email
    );
    if (!addUser) throw new BadRequestException(GConfig.USER_NOT_FOUND);

    group.users.push(addUser);
    this.groupRepository.save(group);
  }
}
