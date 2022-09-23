import { IUserDoExam } from '@monorepo/multichoice/dto';
import React, { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import ToolTip from '../../../components/Commons/ToolTip/ToolTip';
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

  const getStatisticUserDetail = async () => {
    try {
      const payload: IPayloadGetUserExamDetail = {
        topicId: Number(topic_id) || -1,
        userId: userData.userId,
      };
      const response = await examServices.getUserExamDetail(payload);
      console.log(response);
    } catch {
      //
    }
  };

  useEffect(() => {
    getStatisticUserDetail();
  }, [userData]);

  if (!Object.keys(userData).length) return null;

  return (
    <div className="max-w-4xl w-full h-max py-8 px-5 mx-auto rounded-md bg-white">
      <div className="modal-header flex items-center justify-between mb-8">
        <h4 className="text-slate-800 text-xl font-semibold">Kết quả thi</h4>
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
      <div className="modal-body">
        <table className="shadow-xl w-full">
          <thead className="bg-slate-800 text-white text-tiny">
            <tr>
              <th className="py-2 pl-4 text-left capitalize">Tên người thi</th>
              <th className="py-2 pl-4 text-left capitalize">Điểm</th>
              <th className="py-2 pl-4 text-left capitalize">Ngày</th>
              <th className="py-2 pl-4 text-left capitalize">
                Thời gian bắt đầu
              </th>
              <th className="py-2 pl-4 text-left capitalize">
                Thời gian kết thúc
              </th>
            </tr>
          </thead>
          <tbody className="py-4">
            <tr
              className="mb-4 border-b border-slate-200 last:border-none
                      text-slate-800 text-sm cursor-pointer"
            >
              <td className="pl-4 py-10 font-semibold">{userData.userName}</td>
              <td className="pl-4 font-semibold">{userData.point}</td>
              <td className="pl-4">{getDate(userData.start_time)}</td>
              <td className="pl-4">{getTime(userData.start_time)}</td>
              <td className="pl-4">{getTime(userData.end_time)}</td>
            </tr>
          </tbody>
        </table>
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
