import { QuestionTypeEnum } from "@monorepo/multichoice/constant";
import { ApiProperty } from "@nestjs/swagger";

export class CreateQuestionTypeDto {
    @ApiProperty({ enum: QuestionTypeEnum, default: QuestionTypeEnum.SINGLE })
    typeName: QuestionTypeEnum
}