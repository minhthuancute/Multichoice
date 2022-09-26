import React from 'react';
import { Questiondetail } from '@monorepo/multichoice/dto';
import { classNames } from '../../helper/classNames';
import { IAnswer } from '../../types';
import PolaCode from '../PolaCode/PolaCode';
import { BiCheckDouble } from 'react-icons/bi';
import { QuestionType } from '../../types/ICommons';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';

interface IQuestionsUserExamProps {
  questions: Questiondetail[];
}

const QuestionsUserExam: React.FC<IQuestionsUserExamProps> = ({
  questions,
}) => {
  const isCorrectMultiAnswer = (
    answers: IAnswer[],
    answersUser: number[],
    questionType: QuestionType
  ): boolean => {
    if (questionType.toUpperCase() === 'SINGLE') return true;

    const correctAnswersObj = answers
      .filter((answer: IAnswer) => answer.isCorrect)
      .reduce((acc: any, answer: IAnswer) => {
        acc[answer.id] = answer.id;
        return acc;
      }, {});

    const answersUserObj = answersUser.reduce((acc: any, answer: number) => {
      acc[answer] = answer;
      return acc;
    }, {});
    const isCorrect =
      JSON.stringify(correctAnswersObj) === JSON.stringify(answersUserObj);
    return isCorrect;
  };

  return (
    <div>
      {questions &&
        questions.map((question: Questiondetail, indexQuestion: number) => {
          return (
            <ul
              className="relative border-b border-slate-200 last:border-none py-5 px-6 bg-slate-50 shadow-md mb-2.5 last:mb-0"
              key={question.id}
            >
              <div className="header-left flex text-tiny mb-2">
                <span className="w-21 font-semibold mr-1">
                  Câu hỏi {indexQuestion + 1}:
                </span>
                <PolaCode content={question.content} />
              </div>
              {question &&
                question.answers.map((answer: IAnswer, indexAnswer: number) => {
                  const isCorrectMulti = isCorrectMultiAnswer(
                    question.answers,
                    question.answerUser,
                    `${question.type}` as QuestionType
                  );
                  return (
                    <li
                      key={answer.id}
                      className="flex items-start text-slate-800 text-sm mb-1 last:mb-0"
                    >
                      <BiCheckDouble
                        className={classNames(
                          'absolute left-1 mt-1 min-w-max',
                          {
                            'text-green-500': answer.isCorrect,
                            hidden: !answer.isCorrect,
                          }
                        )}
                      />
                      <span
                        className={classNames(
                          'font-semibold flex items-center min-w-max',
                          {
                            // for correct
                            'text-green-600 underline':
                              question.type === QuestionTypeEnum.SINGLE
                                ? question.answerUser.includes(answer.id) &&
                                  answer.isCorrect
                                : question.answerUser.includes(answer.id) &&
                                  isCorrectMulti,
                            // for incorrect
                            'text-red-500 underline':
                              question.type === QuestionTypeEnum.SINGLE
                                ? question.answerUser.includes(answer.id) &&
                                  !answer.isCorrect
                                : question.answerUser.includes(answer.id) &&
                                  !isCorrectMulti,
                          }
                        )}
                      >
                        Đáp án {String.fromCharCode(65 + indexAnswer)} :
                      </span>
                      <span className="ml-2">{answer.content}</span>
                    </li>
                  );
                })}
            </ul>
          );
        })}
    </div>
  );
};

export default QuestionsUserExam;
