import React from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import { START_TIME } from '../../../constants/contstants';
import { classNames } from '../../../helper/classNames';
import { sessionServices } from '../../../services/Applications/SessionServices';
import { answerStore, examStore } from '../../../store/rootReducer';
import { IQuestion } from '../../../types/Topic';
import CountDown from '../../Commons/CountDown/CountDown';
import PolaCode from '../../Commons/PolaCode/PolaCode';

interface INavQuestion {
  indexQuestion: number;
  setIndexQuestion: React.Dispatch<React.SetStateAction<number>>;
}

const NavQuestion: React.FC<INavQuestion> = ({
  indexQuestion = 0,
  setIndexQuestion,
}) => {
  const { answers } = answerStore();

  const {
    exam: { questions },
  } = examStore();

  const navigateQuestion = (index: number) => {
    setIndexQuestion(index);
  };

  return (
    <div className="bg-white shadow-xl w-full min-h-[448px] p-4 relative">
      <div className="mb-2">
        <h2 className="text-center text-lg font-semibold text-slate-800 capitalize">
          Danh sách câu hỏi
        </h2>
      </div>

      <ul className="overflow-auto max-h-96">
        {questions &&
          questions.map((question: IQuestion, index: number) => {
            return (
              <li
                className="mb-1.5 last:mb-0 cursor-pointer flex"
                onClick={() => navigateQuestion(index)}
                key={question.id}
              >
                <BiCheckDouble
                  className={classNames('mr-2 mt-1 min-w-max', {
                    'opacity-50': answers[index]?.answerID?.length === 0,
                    'opacity-100 text-primary-800':
                      answers[index]?.answerID.length !== 0,
                  })}
                />
                <h4
                  className={classNames(
                    `text-sm text-slate-800 whitespace-nowrap overflow-ellipsis overflow-hidden flex`,
                    {
                      'font-semibold': index === indexQuestion,
                    }
                  )}
                >
                  Câu hỏi {index + 1}:{' '}
                  <PolaCode
                    content={question.content}
                    className="ml-2 h-5 inline-block whitespace-nowrap overflow-ellipsis overflow-hidden"
                  />
                </h4>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default NavQuestion;
