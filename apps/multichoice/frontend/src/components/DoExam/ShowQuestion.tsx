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
import { START_TIME } from '../../constants/contstants';

import './doExam.scss';
import { classNames } from '../../helper/classNames';

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
  } = examStore();
  const { userDoExam } = examStore();
  const { exam } = examStore();
  const { answers, updateAnswer } = answerStore();

  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [openModalResult, setOpenModalResult] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<IExamResult>();

  const startTime: number = localServices.getData(START_TIME) || 0;
  const endTime: number = +exam.expirationTime;

  const nextQuestion = (e: React.MouseEvent<HTMLElement>) => {
    const questionLength = questions.length;
    if (indexQuestion + 1 >= questionLength) {
      e.preventDefault();
      return;
    }
    setIndexQuestion(indexQuestion + 1);
  };

  const preQuestion = (e: React.MouseEvent<HTMLElement>) => {
    if (indexQuestion - 1 < 0) {
      e.preventDefault();
      return;
    }
    setIndexQuestion(indexQuestion - 1);
  };

  const onChooseAnswer = (answerID: number) => {
    const questionID = questions[indexQuestion].id;
    updateAnswer(questionID, [answerID]);
  };

  const countUnSelectAnswer = (): number => {
    const count = answers.filter((answer: IAnswers) => {
      return answer.answerID.length === 0;
    });
    return count.length;
  };

  const onSumitAnswers = async () => {
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

        setOpenModalResult(true);
        notify({
          message: 'Nộp bài thành công!',
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
        <button
          className={classNames(`px-6 py-2.5 bg-violet-600 rounded-md text-sm
            text-white flex items-center mb-4 font-semibold
            focus:ring-violet-300 focus:ring`)}
          onClick={() => setOpenModalConfirm(true)}
        >
          Nộp bài
        </button>
        <CountDown
          startTime={startTime}
          endTime={endTime}
          key="count-down"
          textColor="text-green-600"
        />
      </header>

      <div className="p-10 bg-slate-50 shadow-xl min-h-[268px]">
        <h4 className="text-slate-800 text-xl font-semibold">
          Câu hỏi {indexQuestion + 1}:{' '}
          <span>{questions[indexQuestion].content}</span>{' '}
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
                        type="radio"
                        name={'correct-answer'}
                        id={'correct-answer-' + index}
                        className="peer checkbox-answer"
                        checked={isCheckAnswer(answers.id)}
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
          onClick={(e: React.MouseEvent<HTMLElement>) => preQuestion(e)}
        >
          <BiSkipPrevious className="mr-1 text-xl" />
          Câu hỏi trước
        </button>
        <button
          className="px-4 py-1 bg-primary-900 rounded-sm text-sm
          text-white flex items-center focus:ring-primary-200 focus:ring"
          onClick={(e: React.MouseEvent<HTMLElement>) => nextQuestion(e)}
        >
          Câu hỏi sau
          <BiSkipNext className="ml-1 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ShowQuestion;
