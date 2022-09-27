import React from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import { classNames } from '../../helper/classNames';
import { answerStore, examStore } from '../../store/rootReducer';
import { IQuestion } from '../../types';
import PolaCode from '../PolaCode/PolaCode';

interface INavQuestion {
  indexQuestion: number;
  setIndexQuestion: React.Dispatch<React.SetStateAction<number>>;
}

const NavQuestion: React.FC<INavQuestion> = ({
  indexQuestion = 0,
  setIndexQuestion,
}) => {
  const {
    exam: { questions },
  } = examStore();
  const { answers } = answerStore();

  const navigateQuestion = (index: number) => {
    setIndexQuestion(index);
  };

  return (
    <div className="shadow-xl w-full min-h-[430px] px-8 py-6 bg-slate-50 ">
      <h2 className="text-center font-semibold text-slate-800">
        DANH SÁCH CÂU HỎI
      </h2>
      <ul className="mt-2 overflow-auto max-h-96">
        {questions &&
          questions.map((question: IQuestion, index: number) => {
            return (
              <li
                className="mb-1.5 last:mb-0 cursor-pointer flex"
                onClick={() => navigateQuestion(index)}
                key={question.id}
              >
                <BiCheckDouble
                  className={classNames('mr-2 min-w-max', {
                    'opacity-50': answers[index].answerID.length === 0,
                    'opacity-100 text-primary-900':
                      answers[index].answerID.length !== 0,
                  })}
                />
                <h4
                  className={classNames(
                    `text-sm text-slate-800 whitespace-nowrap overflow-ellipsis overflow-hidden
                    hover:underline flex`,
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
