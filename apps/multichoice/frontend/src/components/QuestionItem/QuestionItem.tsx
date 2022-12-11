import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { classNames } from '../../helper/classNames';
import ToolTip from '../Commons/ToolTip/ToolTip';
import PolaCode from '../Commons/PolaCode/PolaCode';
import { IQuestion } from '../../types/Topic';

export interface IQuestionItemProps {
  index: number;
  question: IQuestion;
  onClickUpdateQuestion: (question: IQuestion) => void;
  onClickDeleteQuestion: (question: IQuestion) => void;
}

const QuestionItem: React.FC<IQuestionItemProps> = ({
  question,
  index,
  onClickUpdateQuestion,
  onClickDeleteQuestion,
}) => {
  const isTypeText = question.type === QuestionTypeEnum.TEXT;

  return (
    <div className="container mb-4 last:mb-0">
      <div className="question-content py-4 px-6 bg-white rounded-lg">
        <div
          className={classNames(
            'header text-slate-800 text-tiny flex justify-between h-max'
          )}
        >
          <div className="header-left flex text-tiny">
            <span className="font-semibold mr-2 min-w-max">
              Câu hỏi {index}:
            </span>
            {/* <PolaCode content={question.content} /> */}
          </div>
          <div className="header-right ml-2">
            <ul className="ctas flex items-center ml-auto">
              <li className="relative group mr-5 mb-0.5">
                <ToolTip title="Cập nhật câu hỏi">
                  <button onClick={() => onClickUpdateQuestion(question)}>
                    <FaPencilAlt className="text-slate-800 text-xs" />
                  </button>
                </ToolTip>
              </li>
              <li className="relative group">
                <ToolTip title="Xóa">
                  <button onClick={() => onClickDeleteQuestion(question)}>
                    <RiDeleteBin6Line className="text-red-500 text-base" />
                  </button>
                </ToolTip>
              </li>
            </ul>
          </div>
        </div>

        <PolaCode content={question.content} />

        <div
          className={classNames('body mt-2', {
            'pt-2 border-t border-slate-200': !isTypeText,
          })}
        >
          <ul>
            {question &&
              question.answers.map((answer, index: number) => (
                <li
                  key={answer.id}
                  className="flex items-start text-slate-800 text-tiny mb-2 last:mb-0"
                >
                  <span
                    className={classNames(
                      'font-semibold flex items-center min-w-max',
                      {
                        'text-green-600': answer.isCorrect,
                      }
                    )}
                  >
                    Đáp án {String.fromCharCode(65 + index)} :
                  </span>
                  <span className="ml-2">{answer.content}</span>
                </li>
              ))}
          </ul>

          {question.type === QuestionTypeEnum.MULTIPLE ? (
            <div className="mt-2">
              <p className="text-sm text-primary-800 italic">
                (Có thể có nhiều đáp án đúng)
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
