import React, { useEffect, useState } from 'react';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { iNotification } from 'react-notifications-component';
import { notify } from '../../helper/notify';
import { examServices, IPayloadEndExam } from '../../services/ExamServices';
import { answerStore, examStore, IAnswers } from '../../store/rootReducer';
import { IAnswer } from '../../types';
import ExamResult from './ExamResult';
import ConfirmSubmit from './ConfirmSubmit';
import CountDown from '../Commons/CountDown/CountDown';
import { localServices } from '../../services/LocalServices';
import { IS_SUBMIT_EXAM, START_TIME } from '../../constants/contstants';
import { classNames } from '../../helper/classNames';
import ToolTip from '../Commons/ToolTip/ToolTip';
import PolaCode from '../PolaCode/PolaCode';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { QuestionType } from '../../types/ICommons';

import {
  errCanNotSubmit,
  expriedTime,
  submited,
  submitSuccess,
} from '../../constants/msgNotify';

import TextArea from '../Commons/TextArea/TextArea';
import './doExam.scss';

interface IExamResult {
  user_name: string;
  point: number;
}

interface IShowQuestionProps {
  indexQuestion: number;
  setIndexQuestion: React.Dispatch<React.SetStateAction<number>>;
  startTimeCountdown?: number;
  expriedCountdownRealtime?: boolean;
}

const ShowQuestion: React.FC<IShowQuestionProps> = ({
  indexQuestion = 0,
  setIndexQuestion,
  startTimeCountdown = 0,
  expriedCountdownRealtime = false,
}) => {
  const {
    exam: { questions },
    setDataExamResult,
    exam,
    setIsSubmitExam,
    isSubmitExam,
    isExpriedExam,
  } = examStore();
  const { answers, updateAnswer, userDoExam } = answerStore();

  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [openModalResult, setOpenModalResult] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<IExamResult>();
  const [errorMsgSubmit, setErrorMsgSubmit] = useState<string>('');

  const startTime: number = localServices.getData(START_TIME) || 0;
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
      setIndexQuestion(exam.questions.length - 1);
    } else {
      setIndexQuestion(indexQuestion - 1);
    }
  };

  const onChooseAnswer = (
    answerID: number | string,
    questionType: QuestionType
  ) => {
    const questionID = questions[indexQuestion].id;

    updateAnswer(questionID, answerID, questionType);
  };

  const onChangeTextarea = (value: string) => {
    // updateAnswer(questionID, answerID, questionType);
    console.log(value);
  };

  const countUnSelectAnswer = (): number => {
    const count = answers.filter((answer: IAnswers) => {
      return answer?.answerID.length === 0;
    });
    return count.length;
  };

  const onSumitAnswers = async () => {
    setIsSubmitExam(true);
    setErrorMsgSubmit('Bạn đã nộp bài');
    localServices.setData(IS_SUBMIT_EXAM, true);
    try {
      const payload: IPayloadEndExam = {
        userID: userDoExam.user_id,
        answerUsers: answers,
      };

      const { data } = await examServices.submitExam(payload);

      if (data.success) {
        setExamResult({
          user_name: data.data.username,
          point: data.data.point,
        } as IExamResult);
        setDataExamResult({
          user_name: data.data.username,
          point: data.data.point,
        });

        setOpenModalResult(true);
        notify({
          message: submitSuccess,
        } as iNotification);
      }
    } catch (error: any) {
      if (error.response.data.statusCode === 400) {
        notify({
          message: errCanNotSubmit,
          type: 'danger',
        } as iNotification);
      }
    }
    setOpenModalConfirm(false);
    setConfirmSubmit(false);
  };

  const requestSubmit = () => {
    if (isExpriedExam) {
      setErrorMsgSubmit(expriedTime);
      notify({
        message: expriedTime,
        type: 'danger',
      } as iNotification);
      return;
    }
    if (isSubmitExam) {
      setErrorMsgSubmit(submited);
      notify({
        message: submited,
        type: 'danger',
      } as iNotification);
      return;
    }
    setOpenModalConfirm(true);
  };

  const onCancleModalConfirm = () => {
    setOpenModalConfirm(false);
    setConfirmSubmit(false);
  };

  const isCheckAnswer = (answerID: number): boolean => {
    const shouldChecked = (
      answers[indexQuestion]?.answerID as number[]
    )?.includes(answerID);

    return shouldChecked;
  };

  useEffect(() => {
    if (confirmSubmit) {
      onSumitAnswers();
    }
  }, [confirmSubmit]);

  if (!questions) {
    return null;
  }

  const questionType = questions[indexQuestion].type;
  return (
    <div className="w-full h-full">
      <div className="modals">
        <ExamResult
          setOpenModalResult={setOpenModalResult}
          openModalResult={openModalResult}
          user_name={examResult?.user_name || ''}
          point={examResult?.point || 0}
        />

        <ConfirmSubmit
          setConfirmSubmit={setConfirmSubmit}
          onCancleModalConfirm={onCancleModalConfirm}
          setOpenModalConfirm={setOpenModalConfirm}
          openModalConfirm={openModalConfirm}
          unSelectAnswer={countUnSelectAnswer()}
        />
      </div>

      <header className="flex items-start xs:justify-between lg:justify-center">
        {expriedCountdownRealtime === false ? (
          <ToolTip title={errorMsgSubmit}>
            <button
              className={classNames(
                `px-6 py-2.5 bg-primary-800 rounded-md text-sm
            text-white flex items-center mb-4 font-semibold
            focus:ring-blue-100 focus:ring`,
                {
                  hidden: isSubmitExam || localServices.getData(IS_SUBMIT_EXAM),
                }
              )}
              onClick={() => requestSubmit()}
            >
              Nộp Bài
            </button>
          </ToolTip>
        ) : null}

        <div className="lg:hidden">
          <CountDown
            isHidden={isSubmitExam}
            startTime={startTimeCountdown || startTime}
            endTime={endTime}
            key="count-down"
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
          {indexQuestion + 1}/{exam.questions.length}
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

      <div className="p-4 lg:p-10 bg-slate-50 shadow-xl lg:min-h-[335px] xs:min-h-[435px]">
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
                          questionType === QuestionTypeEnum.MULTIPLE
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
                            `${questionType}` as QuestionType
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

          {questionType === QuestionTypeEnum.MULTIPLE ? (
            <div className="mt-3">
              <p className="text-sm text-primary-800 italic text-center">
                (Có thể có nhiều đáp án đúng)
              </p>
            </div>
          ) : null}

          {questionType === QuestionTypeEnum.TEXT ? (
            <TextArea
              key={'answer-' + indexQuestion}
              defaultValue={answers[indexQuestion].answerID}
              onChange={(value: string) => {
                onChangeTextarea(value);
                onChooseAnswer(value, `${questionType}` as QuestionType);
              }}
              placeholder="Nhập câu trả lời..."
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ShowQuestion);
