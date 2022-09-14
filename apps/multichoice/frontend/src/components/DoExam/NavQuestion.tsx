import React from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import { classNames } from '../../helper/classNames';
import { answerStore, examStore } from '../../store/rootReducer';
import { IQuestion } from '../../types';

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
    <div className="shadow-xl w-full min-h-[420px] px-8 py-6 bg-slate-50 ">
      <h2 className="text-center text-xl text-slate-800">Danh sách câu hỏi</h2>
      <ul className="mt-2 overflow-auto h-max">
        {questions &&
          questions.map((question: IQuestion, index: number) => {
            return (
              <li
                className="mb-1.5 last:mb-0 cursor-pointer flex items-center"
                onClick={() => navigateQuestion(index)}
                key={question.id}
              >
                <BiCheckDouble
                  className={classNames('mr-2', {
                    'opacity-50': answers[index].answerID.length === 0,
                    'opacity-100 text-green-500':
                      answers[index].answerID.length !== 0,
                  })}
                />
                <h4
                  className={classNames(
                    `text-sm whitespace-nowrap overflow-ellipsis overflow-hidden text-slate-800
                    hover:underline`,
                    {
                      'font-semibold': index === indexQuestion,
                    }
                  )}
                >
                  Câu hỏi {index + 1}: <span>{question.content}</span>
                </h4>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default NavQuestion;
