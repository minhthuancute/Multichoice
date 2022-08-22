import React from 'react';
import { BsCalendarDate } from 'react-icons/bs';
import { AiOutlineQuestionCircle, AiOutlineFieldTime } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaPencilAlt } from 'react-icons/fa';

import { getDate } from '../../utils/formatDate';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { Link } from 'react-router-dom';

export interface ITestItem {
  id: number;
  title: string;
  date: string;
  questionCount: number;
  expirationTime: number;
}

interface ITestItemProp {
  test: ITestItem;
}

const TestItem: React.FC<ITestItemProp> = ({ test }) => {
  return (
    <div className="test-item cursor-pointer p-4 rounded-md bg-white mb-3 last:mb-0">
      <div className="test-item__header title">
        <h3 className="font-semibold text-tiny">{test.title}</h3>
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
          <li className="flex items-center text-sm">
            <AiOutlineFieldTime className="text-slate-800 mr-1 text-base" />
            <span>{test.expirationTime} phút</span>
          </li>
        </ul>
        <div className="right">
          <ul className="ctas flex items-center">
            <li className="relative group mr-4 mb-1.5">
              <ToolTip title="Cập nhật đề thi">
                <Link to={'/tests/edit/' + test.id}>
                  <FaPencilAlt className="text-slate-800 text-sm" />
                </Link>
              </ToolTip>
            </li>
            <li className="relative group">
              <ToolTip title="Xóa">
                <button>
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

export default TestItem;
