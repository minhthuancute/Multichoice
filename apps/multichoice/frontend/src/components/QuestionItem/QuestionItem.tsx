import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { IQuestion } from '../../types';
import ToolTip from '../Commons/ToolTip/ToolTip';

export interface IQuestionItem {
  index: number;
  question: IQuestion;
  handleDeleteQuestion: (question: IQuestion) => void;
}

const QuestionItem: React.FC<IQuestionItem> = ({
  question,
  index,
  handleDeleteQuestion,
}) => {
  return (
    <div className="container mb-4 last:mb-0">
      <div className="question-content p-4 bg-white rounded-lg">
        <div className="header text-slate-800 text-tiny flex">
          <span className="font-semibold mr-2">Câu hỏi {index}:</span>
          <p className="">{question.content}</p>
        </div>
        <div className="body flex">
          <ul className="ctas flex items-center ml-auto">
            <li className="relative group mr-4 mb-1.5">
              <ToolTip title="Cập nhật câu hỏi">
                <Link to="/">
                  <FaPencilAlt className="text-slate-800 text-sm" />
                </Link>
              </ToolTip>
            </li>
            <li className="relative group">
              <ToolTip title="Xóa">
                <button onClick={() => handleDeleteQuestion(question)}>
                  <RiDeleteBin6Line className="text-red-500 text-xl" />
                </button>
              </ToolTip>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
