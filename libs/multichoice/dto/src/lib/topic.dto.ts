import { TopicCategoryEnum, TopicTimeTypeEnum } from "@monorepo/multichoice/constant"
import { ApiProperty } from "@nestjs/swagger"

export class CreateTopicDto {

    @ApiProperty({ enum: TopicTimeTypeEnum, default: TopicTimeTypeEnum.FIXEDTIME })
    timeTpye: TopicTimeTypeEnum

    @ApiProperty({ enum: TopicCategoryEnum, default: TopicCategoryEnum.NONE })
    typeName: TopicCategoryEnum

    @ApiProperty()
    title: string

    @ApiProperty({ default: false })
    isDraft: boolean

    @ApiProperty()
    expirationTime: number
}
