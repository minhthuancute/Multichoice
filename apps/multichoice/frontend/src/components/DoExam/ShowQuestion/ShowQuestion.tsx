import React, { useEffect, useState } from 'react';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { iNotification } from 'react-notifications-component';
import { notify } from '../../../helper/notify';
import {
  examServices,
  IPayloadEndExam,
  IPayloadEndExamRealtime,
} from '../../../services/ExamServices';
import { answerStore, examStore, IAnswers } from '../../../store/rootReducer';
import { IAnswer } from '../../../types';
import ExamResult from '../ExamResult/ExamResult';
import ConfirmSubmit from '../ConfirmSubmit/ConfirmSubmit';
import CountDown from '../../Commons/CountDown/CountDown';
import { IS_SUBMIT_EXAM, START_TIME } from '../../../constants/contstants';
import { classNames } from '../../../helper/classNames';
import ToolTip from '../../Commons/ToolTip/ToolTip';
import PolaCode from '../../Commons/PolaCode/PolaCode';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { expriedTime, submited } from '../../../constants/msgNotify';
import TextArea from '../../Commons/TextArea/TextArea';
import { sessionServices } from '../../../services/SessionServices';
import { useParams } from 'react-router-dom';

import './style.scss';

interface IExamResult {
  userName: string;
  point: number;
}

interface IShowQuestionProps {
  isRealtime?: boolean;
  indexQuestion: number;
  setIndexQuestion: React.Dispatch<React.SetStateAction<number>>;
  startTimeCountdown?: number;
  expriedCountdownRealtime?: boolean;
}

const ShowQuestion: React.FC<IShowQuestionProps> = ({
  isRealtime = false,
  indexQuestion = 0,
  setIndexQuestion,
  startTimeCountdown = 0,
  expriedCountdownRealtime = false,
}) => {
  const { url } = useParams();

  const {
    exam: { questions },
    setDataExamResult,
    exam,
    isSubmitExam,
    isExpriedExam,
  } = examStore();
  const { answers, updateAnswer, userDoExam } = answerStore();

  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [openModalResult, setOpenModalResult] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<IExamResult>();
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
      setIndexQuestion(exam.questions.length - 1);
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

  const countUnSelectAnswer = (): number => {
    const count = answers.filter((answer: IAnswers) => {
      return answer?.answerID.length === 0;
    });
    return count.length;
  };

  const onSumitAnswers = async () => {
    sessionServices.setData(IS_SUBMIT_EXAM, true);
    try {
      const payload: IPayloadEndExam = {
        userID: userDoExam.userId,
        answerUsers: answers,
      };

      const payloadRealtime: IPayloadEndExamRealtime = {
        url: url || '',
        userID: userDoExam.userId,
        answerUsers: answers,
      };

      const { data } = isRealtime
        ? await examServices.submitExam(payload)
        : await examServices.submitExamRealtime(payloadRealtime);

      if (data.success) {
        setExamResult({
          userName: data.data.username,
          point: data.data.point,
        } as IExamResult);
        setDataExamResult({
          userName: data.data.username,
          point: data.data.point,
        });

        setOpenModalResult(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const { message } = error.response.data;
      notify({
        message: message,
        type: 'danger',
      } as iNotification);
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

  return questions ? (
    <div className="w-full h-full">
      <div className="modals">
        <ExamResult
          setOpenModalResult={setOpenModalResult}
          openModalResult={openModalResult}
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
                `px-8 py-2 bg-primary-800 rounded-3xl text-sm text-white
                mb-4 font-semibold focus:ring-blue-100 focus:ring`
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
              onChange={(value: string) => {
                onChooseAnswer(value, questions[indexQuestion].type);
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
