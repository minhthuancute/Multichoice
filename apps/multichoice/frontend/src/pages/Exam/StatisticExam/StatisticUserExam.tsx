import { IUserDoExam, IUserDoExamdetail } from '@monorepo/multichoice/dto';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import ToolTip from '../../../components/Commons/ToolTip/ToolTip';
import QuestionsUserExam from '../../../components/QuestionsUserExam/QuestionsUserExam';
import {
  examServices,
  IPayloadGetUserExamDetail,
} from '../../../services/ExamServices';
import { getDate, getTime } from '../../../utils/formatDate';

interface IStatisticUserExamProps {
  setShowModalUserExamDetail: React.Dispatch<React.SetStateAction<boolean>>;
  userData: IUserDoExam;
}

const StatisticUserExam: React.FC<IStatisticUserExamProps> = ({
  setShowModalUserExamDetail,
  userData,
}) => {
  const { id: topic_id } = useParams();

  const [userExamDetail, setUserExamDetail] = useState<IUserDoExamdetail>();

  const getStatisticUserDetail = async () => {
    try {
      const payload: IPayloadGetUserExamDetail = {
        topicId: Number(topic_id) || -1,
        userId: userData.userId,
      };
      const response = await examServices.getUserExamDetail(payload);
      if (response) {
        const userExamDetail: IUserDoExamdetail = response.data.data;
        setUserExamDetail(userExamDetail);
      }
    } catch {
      //
    }
  };

  useEffect(() => {
    getStatisticUserDetail();
  }, [userData]);

  if (!Object.keys(userData).length) return null;

  return (
    <div className="max-w-6xl w-full h-max py-8 px-5 mx-auto rounded-md bg-white pb-10">
      <div className="modal-header flex items-center justify-between mb-5">
        <h4 className="text-slate-800 text-xl font-semibold">
          Kết quả thi của:{' '}
          <span className="font-semibold">{userData.userName}</span>
        </h4>
        <ToolTip title="Đóng">
          <button
            type="button"
            className="text-lg"
            onClick={() => setShowModalUserExamDetail(false)}
          >
            <IoMdClose />
          </button>
        </ToolTip>
      </div>
      <div className="modal-body pb-4">
        <h4 className="text-primary-900 mb-1 font-semibold underline">
          Chi tiết:
        </h4>
        <ul
          className="relative border-b border-slate-200 last:border-none py-5 px-6 bg-slate-50
        shadow-md last:mb-0 text-tiny text-slate-800"
        >
          <li>
            <span className="font-semibold mr-2">Điểm:</span>
            <span className="text-primary-800 font-semibold underline">
              {userData.point}
            </span>
          </li>
          <li>
            <span className="font-semibold mr-2">Ngày:</span>
            {getDate(userData.start_time)}
          </li>
          <li>
            <span className="font-semibold mr-2">Thời gian bắt đầu:</span>
            {getTime(userData.start_time)}
          </li>
          <li>
            <span className="font-semibold mr-2">Thời gian kết thúc:</span>
            {userData.end_time ? (
              getTime(userData.end_time)
            ) : (
              <span className="text-red-500 font-semibold">Chưa nộp bài</span>
            )}
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-primary-900 mb-1 font-semibold underline">
          Danh sách câu hỏi:
        </h4>
        <QuestionsUserExam questions={userExamDetail?.questions || []} />
      </div>
      <div className="modal-footer mt-8 flex justify-end">
        <button
          type="submit"
          className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-slate-800 transition-all duration-200"
          onClick={() => setShowModalUserExamDetail(false)}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default StatisticUserExam;
