import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './pageMeta.dto';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly result: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly pagination: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.result = data;
    this.pagination = meta;
  }
}
