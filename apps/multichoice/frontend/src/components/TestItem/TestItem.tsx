import React, { useEffect, useState } from 'react';
import { BsCalendarDate, BsPause, BsPlay } from 'react-icons/bs';
import { AiOutlineQuestionCircle, AiOutlineFieldTime } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { getDate } from '../../utils/format_date';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { Link } from 'react-router-dom';
import { TiPencil } from 'react-icons/ti';
import Badge from '../Commons/Badge/Badge';

import { copyClipboard } from '../../helper/copyClipboard';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import { secondsToMinutes } from '../../utils/minutes_to_seconds';
import { ITestRealtimeRecord } from '../../types/ICommons';
import {
  canNotCopyLinkExam,
  copyLinkExamSuccess,
} from '../../constants/msgNotify';
import { fireGet, fireUpdate } from '../../utils/firebase_utils';
import HandlelayTest from './HandlePlayTest';
import {
  firebasePath,
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';

export interface ITestItem {
  topicUrl: string;
  id: number;
  title: string;
  date: string;
  questionCount: number;
  expirationTime: number;
  timeType: `${TopicTimeTypeEnum}`;
  typeCategoryName: `${TopicCategoryEnum}`;
}

interface ITestItemProp {
  test: ITestItem;
  handleDeleteTest: (testID: number, testTitle: string) => void;
}

const TestItem: React.FC<ITestItemProp> = ({ test, handleDeleteTest }) => {
  const isrealtime = test.timeType.toUpperCase() === 'REALTIME';
  const [modalHandlePlayTest, setModalHandlePlayTest] =
    useState<boolean>(false);
  const [startedTestRealtime, setStartedTestRealtime] =
    useState<boolean>(false);
  const [isPlaytest, setIsPlaytest] = useState<boolean>(false);

  const examUrl = (): string => {
    const host = window.location.origin + '/e/';
    return host + test.topicUrl + (isrealtime ? '/do-exam-realtime' : '');
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

  useEffect(() => {
    const testPath: string = `${firebasePath}-` + test.topicUrl;
    fireGet(testPath, (data: any) => {
      const recordValue: ITestRealtimeRecord = data;
      const shouldExpriedTest =
        new Date().getTime() > +recordValue?.startTime + +test?.expirationTime;
      if (shouldExpriedTest) {
        fireUpdate(testPath, {
          started: false,
          duration: 0,
          startTime: 0,
        } as ITestRealtimeRecord);
        setStartedTestRealtime(false);
      }
    });
    // const dev = setInterval(() => {
    //   const shouldExpriedTest =
    //     new Date().getTime() > +time + +test?.expirationTime;
    //   if (shouldExpriedTest) {
    //     fireDelete(testPath);
    //     setStartedTestRealtime(false);
    //   }
    // }, 1000);
    // return () => {
    //   clearInterval(dev);
    // };
  }, []);

  useEffect(() => {
    const testPath: string = 'test-' + test.topicUrl;

    fireGet(testPath, (data: any) => {
      const recordValue: ITestRealtimeRecord = data;

      setStartedTestRealtime(recordValue?.started || false);
      setIsPlaytest(recordValue?.started || false);
    });
  }, [test.topicUrl]);

  return (
    <>
      <HandlelayTest
        openModal={modalHandlePlayTest}
        setOpenModal={setModalHandlePlayTest}
        topicTitle={test.title}
        topicUrl={test.topicUrl}
        isPlaytest={isPlaytest}
      />

      <div className="test-item cursor-pointer p-4 rounded-md bg-white mb-3 last:mb-0">
        <div className="test-item__header title">
          <Link
            className="font-semibold text-lg text-slate-800"
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
              <span>
                {secondsToMinutes(test.expirationTime)} phút
                {test.timeType === 'realtime' ? ' (Realtime)' : null}
              </span>
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
              {test.timeType === 'realtime' ? (
                <li className="relative group mr-4 mt-1">
                  <ToolTip
                    title={
                      startedTestRealtime
                        ? 'Bài thi đã bắt đầu'
                        : 'Bắt đầu làm bài'
                    }
                  >
                    {startedTestRealtime ? (
                      <button
                      // onClick={() => {
                      //   setIsPlaytest(false);
                      //   setModalHandlePlayTest(true);
                      // }}
                      >
                        <BsPause className="text-slate-800 text-2xl" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsPlaytest(true);
                          setModalHandlePlayTest(true);
                        }}
                      >
                        <BsPlay className="text-slate-800 text-2xl" />
                      </button>
                    )}
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
              <Link
                to={
                  '/e/' +
                  test.topicUrl +
                  (isrealtime ? '/do-exam-realtime' : '')
                }
                target="_blank"
              >
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
              className="ml-5 text-sm text-slate-800 font-semibold"
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
