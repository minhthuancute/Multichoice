import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from '@monorepo/multichoice/dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { SucessResponse } from '../model/SucessResponse';
import { plainToClass } from 'class-transformer';
import { Topic } from './entities/topic.entity';
import { QuestionType } from './entities/question-type.entity';
import { Answer } from '../answer/entities/answer.entity';

@Injectable()
export class QuestionService {
  constructor(@InjectRepository(Question) private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionType) private readonly questionTypeRepository: Repository<QuestionType>,
    @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>) { }


  async fineOneByID(id: number): Promise<QuestionType> {

    const result = await this.questionTypeRepository.findOneById(id)
    return result;
  }

  async create(createQuestionDto: CreateQuestionDto, topic: Topic, files: any): Promise<SucessResponse> {

    const questionType: QuestionType = await this.fineOneByID(createQuestionDto.questionTypeID)
    if (!questionType) throw new BadRequestException('questionTypeID is not found')

    const QuestionEntity: Question = plainToClass(Question, createQuestionDto)

    //save image}||audio
    if (files !== undefined) {
      if (files.audio !== undefined) {
        QuestionEntity.audio = files.audio.filename
      }
      if (files.image !== undefined) {
        QuestionEntity.image = files.image.filename
      }
    }

    QuestionEntity.topic = topic
    QuestionEntity.type = questionType

    // save question
    const saveQuestion = await this.questionRepository.save(QuestionEntity);

    // save list answer
    const answers: Answer[] = createQuestionDto.answers.map(opt => {
      const questionOption = new Answer();
      questionOption.content = opt.content
      questionOption.isCorrect = opt.isCorrect
      questionOption.question = saveQuestion;
      return questionOption;
    });
    await this.answerRepository.save(answers)

    return new SucessResponse(200, "Sucess");
  }
}
