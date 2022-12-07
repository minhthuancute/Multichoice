import React, { ChangeEvent, useState } from 'react';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { answerStore, examStore } from '../../../store/rootReducer';
import { IAnswer, IQuestion } from '../../../types';
import ConfirmSubmit from '../ConfirmSubmit/ConfirmSubmit';
import CountDown from '../../Commons/CountDown/CountDown';
import { START_TIME } from '../../../constants/contstants';
import { classNames } from '../../../helper/classNames';
import ToolTip from '../../Commons/ToolTip/ToolTip';
import PolaCode from '../../Commons/PolaCode/PolaCode';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import TextArea from '../../Commons/TextArea/TextArea';
import { sessionServices } from '../../../services/Applications/SessionServices';
import { validArray } from '../../../helper/validArray';
import './style.scss';

interface IShowQuestionProps {
  questions: IQuestion[];
  isRealtime?: boolean;
  indexQuestion: number;
  setIndexQuestion: React.Dispatch<React.SetStateAction<number>>;
  startTimeCountdown?: number;
  expriedRealtime?: boolean;
  isSubmited?: boolean;
}

const ShowQuestion: React.FC<IShowQuestionProps> = ({
  questions = [],
  indexQuestion = 0,
  setIndexQuestion,
  startTimeCountdown = 0,
  expriedRealtime = false,
  isSubmited = false,
}) => {
  const { exam } = examStore();
  const { answers, updateAnswer, userDoExam } = answerStore();

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalSubmit, setVisibleModalSubmit] = useState<boolean>(false);
  const [errorMsgSubmit, setErrorMsgSubmit] = useState<string>('');

  const startTime: number = sessionServices.getData(START_TIME) || 0;
  const endTime: number = +exam.expirationTime;

  const nextQuestion = () => {
    const questionLength = questions.length;
    if (indexQuestion + 1 >= questionLength) {
      setIndexQuestion(0);
    } else {
      setIndexQuestion(indexQuestion + 1);
    }
  };

  const preQuestion = () => {
    if (indexQuestion - 1 < 0) {
      setIndexQuestion(questions.length - 1);
    } else {
      setIndexQuestion(indexQuestion - 1);
    }
  };

  const onChooseAnswer = (
    answerID: number | string,
    questionType: `${QuestionTypeEnum}`
  ) => {
    const questionID = questions[indexQuestion].id;
    updateAnswer(questionID, answerID, questionType);
  };

  const isCheckAnswer = (answerID: number): boolean => {
    const shouldChecked = (
      answers[indexQuestion]?.answerID as number[]
    )?.includes(answerID);

    return shouldChecked;
  };

  return validArray(questions) ? (
    <div className="w-full h-full">
      <div className="modals">
        <ConfirmSubmit
          setVisibleModal={setVisibleModalSubmit}
          visibleModal={visibleModalSubmit}
        />
      </div>

      <header className="flex items-start xs:justify-between lg:justify-center">
        {expriedRealtime === false ? (
          <ToolTip title={errorMsgSubmit}>
            <button
              className={classNames(
                `px-8 py-2 bg-primary-800 rounded-3xl text-sm text-white
                mb-4 font-semibold focus:ring-blue-100 focus:ring`,
                {
                  hidden: isSubmited,
                }
              )}
              onClick={() => setVisibleModalSubmit(true)}
            >
              Nộp Bài
            </button>
          </ToolTip>
        ) : null}

        <div className="lg:hidden">
          <CountDown
            isHidden={isSubmited}
            startTime={startTimeCountdown || startTime}
            endTime={endTime}
            key="count-down-mobile"
            className="text-primary-800"
          />
        </div>
      </header>

      <div className="ctas mb-2 flex items-center justify-between">
        <button
          className="px-4 py-1 bg-slate-800 rounded-sm text-sm
          text-white flex items-center focus:ring-blue-100 focus:ring"
          onClick={() => preQuestion()}
        >
          <BiSkipPrevious className="mr-1 text-xl" />
          Câu hỏi trước
        </button>
        <span className="text-slate-800 font-semibold">
          {indexQuestion + 1}/{questions.length}
        </span>

        <button
          className="px-4 py-1 bg-slate-800 rounded-sm text-sm
          text-white flex items-center focus:ring-blue-100 focus:ring"
          onClick={() => nextQuestion()}
        >
          Câu hỏi sau
          <BiSkipNext className="ml-1 text-xl" />
        </button>
      </div>

      <div className="p-4 bg-white lg:p-10 shadow-xl lg:min-h-[335px] xs:min-h-[435px]">
        <h4 className="text-slate-800 xs:text-tiny lg:text-lg lg:flex items-start">
          <span className="min-w-max flex font-semibold">
            Câu hỏi {indexQuestion + 1}:{' '}
          </span>
          <PolaCode
            content={questions[indexQuestion].content}
            className="lg:ml-2 flex-1"
          />
        </h4>

        <div className="mt-5">
          {questions &&
            questions[indexQuestion].answers.map(
              (answers: IAnswer, index: number) => {
                return (
                  <label
                    className="answer-item text-tiny text-slate-800 mb-4 last:mb-0
                    flex items-center cursor-pointer group"
                    htmlFor={'correct-answer-' + index}
                    key={answers.id}
                  >
                    <div className="checkbox mr-4">
                      <input
                        hidden
                        type={
                          questions[indexQuestion].type ===
                          QuestionTypeEnum.MULTIPLE
                            ? 'checkbox'
                            : 'radio'
                        }
                        name={'correct-answer'}
                        id={'correct-answer-' + index}
                        className="peer select-answer"
                        defaultChecked={isCheckAnswer(answers.id)}
                        onChange={() =>
                          onChooseAnswer(
                            answers.id,
                            questions[indexQuestion].type
                          )
                        }
                      />
                      <div
                        className="radio mt-0.5 w-4 h-4 border border-solid rounded-full
                    border-primary-900 before:bg-primary-900 before:w-2.5 before:h-2.5 before:block
                      before:rounded-full flex items-center justify-center before:opacity-0
                      peer-checked:before:opacity-100"
                      ></div>
                    </div>
                    <span className="font-semibold mr-2">
                      {String.fromCharCode(65 + index)}:
                    </span>
                    {answers.content}
                  </label>
                );
              }
            )}

          {questions[indexQuestion].type === QuestionTypeEnum.MULTIPLE ? (
            <div className="mt-3">
              <p className="text-sm text-primary-800 italic text-center">
                (Có thể có nhiều đáp án đúng)
              </p>
            </div>
          ) : null}

          {questions[indexQuestion].type === QuestionTypeEnum.TEXT ? (
            <TextArea
              key={'answer-' + indexQuestion}
              defaultValue={answers[indexQuestion].answerID}
              onInput={(e: ChangeEvent<HTMLAreaElement>) => {
                onChooseAnswer(
                  e.target.textContent as string,
                  questions[indexQuestion].type
                );
                console.log('abasjcbj', e.target.textContent);
              }}
              placeholder="Nhập câu trả lời..."
            />
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default React.memo(ShowQuestion);
