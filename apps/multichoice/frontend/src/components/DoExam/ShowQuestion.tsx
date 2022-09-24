import React, { useEffect, useState } from 'react';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { iNotification } from 'react-notifications-component';
import { notify } from '../../helper/notify';
import { examServices, IPayloadEndExam } from '../../services/ExamServices';
import { answerStore, examStore, IAnswers } from '../../store/rootReducer';
import { IAnswer } from '../../types';
import ExamResult from './ExamResult';
import ConfirmSubmit from './ConfirmSubmit';
import { useNavigate, useParams } from 'react-router-dom';
import CountDown from '../Commons/CountDown/CountDown';
import { localServices } from '../../services/LocalServices';
import { IS_SUBMIT_EXAM, START_TIME } from '../../constants/contstants';

import { classNames } from '../../helper/classNames';
import { cookieServices } from '../../services/CookieServices';

import './doExam.scss';
import ToolTip from '../Commons/ToolTip/ToolTip';
import PolaCode from '../PolaCode/PolaCode';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';

interface IShowQuestion {
  indexQuestion: number;
  setIndexQuestion: React.Dispatch<React.SetStateAction<number>>;
}

interface IExamResult {
  user_name: string;
  point: number;
}

const ShowQuestion: React.FC<IShowQuestion> = ({
  indexQuestion = 0,
  setIndexQuestion,
}) => {
  const navigate = useNavigate();
  const { exam_id } = useParams();

  const {
    exam: { questions },
    setDataExamResult,
  } = examStore();
  const { userDoExam } = examStore();
  const { exam, setIsSubmitExam, isSubmitExam, isExpriedExam } = examStore();
  const { answers, updateAnswer } = answerStore();

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

  const onChooseAnswer = (answerID: number) => {
    const questionID = questions[indexQuestion].id;
    updateAnswer(questionID, answerID);
  };

  const countUnSelectAnswer = (): number => {
    const count = answers.filter((answer: IAnswers) => {
      return answer.answerID.length === 0;
    });
    return count.length;
  };

  const onSumitAnswers = async () => {
    setIsSubmitExam(true);
    setErrorMsgSubmit('Bạn đã nộp bài');
    try {
      const payload: IPayloadEndExam = {
        userID: userDoExam.user_id,
        AnswersUsers: answers,
      } as IPayloadEndExam;
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

        cookieServices.setCookie(IS_SUBMIT_EXAM, true, 30);
        setOpenModalResult(true);
        notify({
          message: 'Nộp bài thành công !',
        } as iNotification);
      }
    } catch (error: any) {
      notify({
        message: error.response.data.message,
        type: 'danger',
      } as iNotification);
    }
    setOpenModalConfirm(false);
    setConfirmSubmit(false);
  };

  const requestSubmit = () => {
    if (isExpriedExam) {
      setErrorMsgSubmit('Hết thời gian nộp bài');
      notify({
        message: 'Hết thời gian nộp bài !',
        type: 'danger',
      } as iNotification);
      return;
    }
    if (isSubmitExam) {
      setErrorMsgSubmit('Bạn đã nộp bài');
      notify({
        message: 'Bạn đã nộp bài !',
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

  useEffect(() => {
    if (confirmSubmit) {
      onSumitAnswers();
    }
  }, [confirmSubmit]);

  const isCheckAnswer = (answerID: number): boolean => {
    const shouldChecked = answers[indexQuestion].answerID.includes(answerID);

    return shouldChecked;
  };

  // if User not provide infor -> redirect User to page Collect Infor
  const checkLogged = () => {
    const preventDoExam = Object.keys(exam).length === 0;
    if (preventDoExam) {
      const urlNavigate = '/exam/' + exam_id;
      navigate(urlNavigate);
    }
  };

  useEffect(() => {
    checkLogged();
  }, []);

  if (!questions) {
    return null;
  }

  return (
    <div className="w-full">
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

      <header className="flex items-start justify-between">
        <ToolTip title={errorMsgSubmit}>
          <button
            className={classNames(
              `px-6 py-2.5 bg-violet-600 rounded-md text-sm
            text-white flex items-center mb-4 font-semibold
            focus:ring-violet-300 focus:ring`,
              {
                'cursor-not-allowed opacity-60': isSubmitExam,
              }
            )}
            onClick={() => requestSubmit()}
          >
            Nộp bài
          </button>
        </ToolTip>

        <CountDown
          startTime={startTime}
          endTime={endTime}
          key="count-down"
          className="text-green-600"
        />
      </header>

      <div className="p-4 lg:p-10 bg-slate-50 shadow-xl min-h-[268px]">
        <h4 className="text-slate-800 text-lg flex items-start">
          <span className="min-w-max">
            Câu hỏi {indexQuestion + 1}:{' '}
          </span>
          <PolaCode
            content={questions[indexQuestion].content}
            className="ml-2"
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
                    onClick={() => onChooseAnswer(answers.id)}
                  >
                    <div className="checkbox mr-4">
                      <input
                        readOnly
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
                    <span>{answers.content}</span>
                  </label>
                );
              }
            )}
        </div>
      </div>
      <div className="ctas mt-10 flex items-center justify-between">
        <button
          className="px-4 py-1 bg-primary-900 rounded-sm text-sm
          text-white flex items-center focus:ring-primary-200 focus:ring"
          onClick={() => preQuestion()}
        >
          <BiSkipPrevious className="mr-1 text-xl" />
          Câu hỏi trước
        </button>
        <span className="text-slate-800 font-semibold">
          {indexQuestion + 1}/{exam.questions.length}
        </span>
        <button
          className="px-4 py-1 bg-primary-900 rounded-sm text-sm
          text-white flex items-center focus:ring-primary-200 focus:ring"
          onClick={() => nextQuestion()}
        >
          Câu hỏi sau
          <BiSkipNext className="ml-1 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ShowQuestion;
