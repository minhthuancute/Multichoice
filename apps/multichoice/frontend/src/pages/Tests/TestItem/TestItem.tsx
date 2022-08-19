import React from 'react';
import { BsCalendarDate } from 'react-icons/bs';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaPencilAlt } from 'react-icons/fa';

import { getDate } from '../../../utils/formatDate';

export interface ITestItem {
  id: number;
  title: string;
  date: string;
  questionCount: number;
}

interface ITestItemProp {
  test: ITestItem;
}

const TestItem: React.FC<ITestItemProp> = ({ test }) => {
  return (
    <div className="test-item cursor-pointer p-4 rounded-md bg-white mb-3 last:mb-0">
      <div className="test-item__header title">
        <h3 className="font-medium text-tiny">{test.title}</h3>
      </div>
      <div className="test-item__body mt-2 flex items-center justify-between">
        <ul className="left flex items-center">
          <li className="flex items-center text-sm mr-3">
            <BsCalendarDate className="text-slate-500 mr-2" />
            <span>{getDate(test.date)}</span>
          </li>
          <li className="flex items-center text-sm mr-3">
            <AiOutlineQuestionCircle className="text-slate-800 mr-1" />
            <span>{test.questionCount} câu hỏi</span>
          </li>
        </ul>
        <div className="right ">
          <ul className="ctas flex items-center">
            <li className="relative group mr-4">
              <button>
                <FaPencilAlt className="p-0.5 text-slate-800" />
              </button>
              <div
                className="text-xs text-white absolute w-max -top-full left-1/2 bg-slate-800 px-2 py-0.5
                transform -translate-x-1/2 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200"
              >
                Cập nhật đề thi
              </div>
            </li>
            <li className="relative group">
              <button>
                <RiDeleteBin6Line className="p-0.5 text-red-500 text-xl" />
              </button>
              <div
                className="text-xs text-white absolute w-max -top-full left-1/2 bg-slate-800 px-2 py-0.5
                transform -translate-x-1/2 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200"
              >
                Xóa
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestItem;
