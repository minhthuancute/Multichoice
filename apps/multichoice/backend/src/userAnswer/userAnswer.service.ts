import { AnswersUserDto } from '@monorepo/multichoice/dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserExam } from '../userExam/entities/userExam.entity';
import { UserAnswer } from './entities/userAnswer.entity';

@Injectable()
export class UserAnswerService {
  constructor(
    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>
  ) {}

  public async saveListUserAnswer(
    answersUserDto: AnswersUserDto[],
    userExam: UserExam
  ): Promise<void> {
    if (answersUserDto) {
      const lst: UserAnswer[] = [];
      answersUserDto.forEach((element) => {
        if (typeof element.answerID === 'object') {
          element.answerID.forEach((item) => {
            const userAnswer: UserAnswer = new UserAnswer();
            userAnswer.answerID = item;
            userAnswer.questionID = element.questionID;
            userAnswer.userExam = userExam;
            lst.push(userAnswer);
          });
        } else {
          const userAnswer: UserAnswer = new UserAnswer();
          userAnswer.answerID = element.answerID;
          userAnswer.questionID = element.questionID;
          userAnswer.userExam = userExam;
          lst.push(userAnswer);
        }
      });
      this.userAnswerRepository.save(lst);
    }
  }
}
