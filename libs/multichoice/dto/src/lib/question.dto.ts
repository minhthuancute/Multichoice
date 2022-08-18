import { ApiProperty } from "@nestjs/swagger";
import { CreatAnswer } from "./answer.dto";

export class CreateQuestionDto {
    @ApiProperty()
    topicID: number

    @ApiProperty()
    questionTypeID: number

    @ApiProperty()
    content: string

    @ApiProperty()
    time: number

    @ApiProperty({ default: true })
    isActive: boolean

    @ApiProperty({ type: [CreatAnswer] })
    answers: CreatAnswer[]
}