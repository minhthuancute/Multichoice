import React from 'react';
import { BsCalendarDate } from 'react-icons/bs';
import { AiOutlineQuestionCircle, AiOutlineFieldTime } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { getDate } from '../../utils/formatDate';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { Link } from 'react-router-dom';
import { TiPencil } from 'react-icons/ti';
import Badge from '../Commons/Badge/Badge';
import { TopicCategoryEnum } from '@monorepo/multichoice/constant';
import { copyClipboard } from '../../helper/copyClipboard';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import { secondsToMinutes } from '../../utils/minutesToSeconds';

export type CategoryType = keyof typeof TopicCategoryEnum;
export interface ITestItem {
  topicUrl: string;
  id: number;
  title: string;
  date: string;
  questionCount: number;
  expirationTime: number;
  typeCategoryName: CategoryType;
}

interface ITestItemProp {
  test: ITestItem;
  handleDeleteTest: (testID: number, testTitle: string) => void;
}

const TestItem: React.FC<ITestItemProp> = ({ test, handleDeleteTest }) => {
  const examUrl = (): string => {
    const host = window.location.origin + '/exam/';
    return host + test.topicUrl;
  };

  const onCopyClipboard = () => {
    const canExam = test.questionCount !== 0;
    if (!canExam) {
      notify({
        message: 'Bạn không thể tạo đợt thi do bộ đề chưa có câu hỏi!',
        type: 'danger',
      } as iNotification);
      return;
    }

    copyClipboard(examUrl());
    notify({
      message: 'Liên kết đã được lưu trữ vào bộ nhớ tạm.',
      type: 'success',
    } as iNotification);
  };

  return (
    <div className="test-item cursor-pointer p-4 rounded-md bg-white mb-3 last:mb-0">
      <div className="test-item__header title">
        <Link
          className="font-semibold text-lg hover:underline text-slate-800"
          to={'/tests/edit/' + test.id}
        >
          {test.title}
        </Link>
      </div>
      <div className="test-item__body mt-2 flex items-center justify-between">
        <ul className="left flex items-center">
          <li className="flex items-center text-tiny mr-3">
            <BsCalendarDate className="text-slate-500 mr-2" />
            <span>{getDate(test.date)}</span>
          </li>
          <li className="flex items-center text-tiny mr-3">
            <AiOutlineQuestionCircle className="text-slate-800 mr-1" />
            <span>{test.questionCount} câu hỏi</span>
          </li>
          <li className="flex items-center text-tiny mr-3">
            <AiOutlineFieldTime className="text-slate-800 mr-1 text-base" />
            <span>{secondsToMinutes(test.expirationTime)} phút</span>
          </li>
          <li>
            <Badge title={test.typeCategoryName} type={test.typeCategoryName} />
          </li>
        </ul>
        <div className="right">
          <ul className="ctas flex items-center">
            <li className="relative group mr-4 mb-0.5">
              <ToolTip title="Cập nhật đề thi">
                <Link to={'/tests/edit/' + test.id}>
                  <TiPencil className="text-slate-800" />
                </Link>
              </ToolTip>
            </li>
            <li className="relative group mr-4">
              <ToolTip title="Xóa">
                <button onClick={() => handleDeleteTest(test.id, test.title)}>
                  <RiDeleteBin6Line className="text-red-500" />
                </button>
              </ToolTip>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="test-footer mt-2 pt-4 flex items-center justify-between
        border-t border-solid border-slate-200"
      >
        <div className="left">
          <Link
            to={'/exam/' + test.topicUrl}
            target="_blank"
            className="text-sm text-primary-900 font-semibold inline-block"
          >
            {test.questionCount === 0
              ? 'Bộ đề chưa có câu hỏi nào. Hãy thêm câu hỏi cho bộ đề'
              : examUrl()}
          </Link>
        </div>
        <div className="right">
          <button
            className="text-sm text-slate-800 font-semibold"
            onClick={() => onCopyClipboard()}
          >
            Sao chép liên kết
          </button>
          <Link
            className="ml-5 text-sm text-slate-800 font-semibold hover:underline"
            to={`/tests/${test.id}/statistic`}
          >
            Thống kê kết quả
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestItem;
