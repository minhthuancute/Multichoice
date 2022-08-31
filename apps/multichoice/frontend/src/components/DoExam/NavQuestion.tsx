import React from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../helper/classNames';
import { examStore } from '../../store/rootReducer';
import { IQuestion } from '../../types';

interface INavQuestion {
  indexQuestion: number;
  setIndexQuestion: React.Dispatch<React.SetStateAction<number>>;
}

const NavQuestion: React.FC<INavQuestion> = ({
  indexQuestion = 0,
  setIndexQuestion,
}) => {
  const navigate = useNavigate();

  const {
    exam: { questions },
  } = examStore();

  const navigateQuestion = (index: number) => {
    setIndexQuestion(index);
  };

  return (
    <div className="shadow-xl w-full h-[600px] ml-6 p-8 bg-slate-50 ">
      <h2 className="text-center text-xl text-slate-800">Danh sách câu hỏi</h2>
      <ul className="mt-2 overflow-auto h-[500px]">
        {questions &&
          questions.map((question: IQuestion, index: number) => {
            return (
              <li
                className="mb-1.5 last:mb-0 cursor-pointer"
                onClick={() => navigateQuestion(index)}
                key={question.id}
              >
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
