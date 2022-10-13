import React, { useState } from 'react';
import { BsCalendarDate, BsPlay } from 'react-icons/bs';
import { AiOutlineQuestionCircle, AiOutlineFieldTime } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { getDate } from '../../utils/formatDate';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { Link } from 'react-router-dom';
import { TiPencil } from 'react-icons/ti';
import Badge from '../Commons/Badge/Badge';

import { copyClipboard } from '../../helper/copyClipboard';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import { secondsToMinutes } from '../../utils/minutesToSeconds';
import { TimeType, TopicCategoryType } from '../../types/ICommons';
import {
  canNotCopyLinkExam,
  copyLinkExamSuccess,
} from '../../constants/msgNotify';
import { HiOutlinePlay } from 'react-icons/hi';
import Modal from '../Modal/Modal';

export interface ITestItem {
  topicUrl: string;
  id: number;
  title: string;
  date: string;
  questionCount: number;
  expirationTime: number;
  timeType: TimeType;
  typeCategoryName: TopicCategoryType;
}

interface ITestItemProp {
  test: ITestItem;
  handleDeleteTest: (testID: number, testTitle: string) => void;
}

const TestItem: React.FC<ITestItemProp> = ({ test, handleDeleteTest }) => {
  const [openModalStartExam, setOpenModalStartExam] = useState<boolean>(false);

  const examUrl = (): string => {
    const host = window.location.origin + '/e/';
    return host + test.topicUrl;
  };

  const onCopyClipboard = () => {
    const canExam = test.questionCount !== 0;
    if (!canExam) {
      notify({
        message: canNotCopyLinkExam,
        type: 'danger',
      } as iNotification);
      return;
    }

    copyClipboard(examUrl());
    notify({
      message: copyLinkExamSuccess,
      type: 'success',
    } as iNotification);
  };

  const handleStartRealtimeTest = (testId: number) => {
    //
  };

  return (
    <>
      <Modal
        openModal={openModalStartExam}
        setOpenModal={setOpenModalStartExam}
        size="sm"
        placement="CENTER"
      >
        <div
          className="modal-content px-5 flex flex-col justify-center
       bg-white rounded-md py-8"
        >
          <div className="header text-center">
            <h4 className="mt-4 text-slate-800 font-semibold text-2xl">
              Bắt đầu bài thi
            </h4>

            <p className="mt-4 text-slate-800">
              Bạn có chắc chắn muốn bắt đầu bài thi?
            </p>
          </div>
          <div className="body ctas flex items-center justify-center gap-x-2 mt-5">
            <button
              className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-slate-800 font-bold border border-solid border-slate-800 focus:ring focus:ring-slate-100"
              onClick={() => setOpenModalStartExam(false)}
            >
              Huỷ
            </button>
            <button
              className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
              // onClick={() => setConfirmSubmit(true)}
            >
              Bắt đầu
            </button>
          </div>
        </div>
      </Modal>

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
              <Badge
                title={test.typeCategoryName}
                type={test.typeCategoryName}
              />
            </li>
          </ul>
          <div className="right">
            <ul className="ctas flex items-center">
              {test.timeType === 'REALTIME' ? (
                <li className="relative group mr-4 mt-1">
                  <ToolTip title="Bắt đầu làm bài">
                    <button onClick={() => setOpenModalStartExam(true)}>
                      <BsPlay className="text-slate-800 text-2xl" />
                    </button>
                  </ToolTip>
                </li>
              ) : null}
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
          <div className="left text-sm text-primary-900 font-semibold inline-block">
            {test.questionCount === 0 ? (
              <p>Bộ đề chưa có câu hỏi nào. Hãy thêm câu hỏi cho bộ đề</p>
            ) : (
              <Link to={'/e/' + test.topicUrl} target="_blank">
                {examUrl()}
              </Link>
            )}
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
    </>
  );
};

export default TestItem;
