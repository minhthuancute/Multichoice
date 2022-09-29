import { IUserDoExam } from '@monorepo/multichoice/dto';
import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { iNotification } from 'react-notifications-component';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/Commons/Breadcrumb/Breadcrumb';
import ToolTip from '../../../components/Commons/ToolTip/ToolTip';
import { notify } from '../../../helper/notify';
import {
  examServices,
  IPayloadDeleteUserExam,
  IPayloadgetListExamByTopicId,
} from '../../../services/ExamServices';
import { getDate, getDistance, getTime } from '../../../utils/formatDate';
import ConfirmDeleteUserExam from '../../../components/Exam/ConfirmDeleteUserExam';
import { getTopicTitle } from '../../../helper/getTopicTitle';
import Select from '../../../components/Commons/Select/Select';
import FilterStatisticExam from '../../../components/Exam/FilterStatisticExam';
import { withBackTop } from '../../../HOCs/withBackTop';
import { secondsToMinutes } from '../../../utils/minutesToSeconds';

const StatisticExam: React.FC = () => {
  const { id: topic_id } = useParams();
  const topicId = Number(topic_id) || -1;

  const [usersDoExam, setUsersDoExam] = useState<IUserDoExam[]>([]);
  const [showModalConfirmDelete, setShowModalConfirmDelete] =
    useState<boolean>(false);
  const [userExamDetail, setUserExamDetail] = useState<IUserDoExam>();
  const [topicTitle, setTopicTitle] = useState<string>('');

  const getListExamByTopicId = async () => {
    try {
      const payload: IPayloadgetListExamByTopicId = {
        topicID: topicId,
      };
      const { data, status } = await examServices.getListExamByTopicId(payload);
      if (status === 200) {
        setUsersDoExam(data.data.reverse());
      }
    } catch (error) {
      //
    }
  };

  const handleDeleteUserExam = async () => {
    try {
      const payload: IPayloadDeleteUserExam = {
        userId: userExamDetail?.userId || -1,
      };
      const response = await examServices.deleteUserExam(payload);
      if (response) {
        const { status } = response;
        if (status) {
          setShowModalConfirmDelete(false);
          notify({
            message: 'Xoá kết quả thi thành công !',
          } as iNotification);
          getListExamByTopicId();
        }
      }
    } catch (error) {
      //
    }
  };

  const requestDeleteUserExam = (rowIndex: number) => {
    setShowModalConfirmDelete(true);
    setUserExamDetail(usersDoExam[rowIndex]);
  };

  useEffect(() => {
    setTopicTitle(getTopicTitle(topicId));
    getListExamByTopicId();
  }, []);

  return (
    <div>
      <header className="container py-4">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/tests">Đề thi</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <div>Thống kê đề {topicTitle}</div>
          </Breadcrumb.Item>
        </Breadcrumb>
      </header>
      <main
        className="bg-slate-50"
        style={{
          minHeight: 'calc(100vh - 106px)',
        }}
      >
        <ConfirmDeleteUserExam
          userData={userExamDetail || ({} as IUserDoExam)}
          onConfirmDelete={handleDeleteUserExam}
          setOpenModalConfirm={setShowModalConfirmDelete}
          openModalConfirm={showModalConfirmDelete}
        />

        <div className="container">
          <div className="flex justify-end items-center">
            <FilterStatisticExam />
          </div>
          <div className=" content-page pt-5 pb-10">
            {usersDoExam && usersDoExam.length ? (
              <table className="shadow-xl w-full">
                <thead className="bg-slate-800 text-white text-tiny">
                  <tr>
                    <th className="py-2 pl-4 text-left capitalize">Stt</th>
                    <th className="py-2 pl-4 text-left capitalize">
                      Tên người thi
                    </th>
                    <th className="py-2 pl-4 text-left capitalize">Điểm</th>
                    <th className="py-2 pl-4 text-left capitalize">Ngày</th>
                    <th className="py-2 pl-4 text-left capitalize">
                      Thời gian bắt đầu
                    </th>
                    <th className="py-2 pl-4 text-left capitalize">
                      Thời gian kết thúc
                    </th>
                    <th className="py-2 pl-4 text-left capitalize">
                      Thời gian làm bài
                    </th>
                    <th className="py-2 pl-4 text-left capitalize">Chi tiết</th>
                    <th className="py-2 pl-4 text-left capitalize">Action</th>
                  </tr>
                </thead>
                <tbody className="py-4">
                  {usersDoExam.length &&
                    usersDoExam.map((user: IUserDoExam, index: number) => (
                      <tr
                        key={user.start_time + user.userName}
                        className="mb-4 border-b border-slate-200 last:border-none
                      text-slate-800 text-sm cursor-pointer even:bg-slate-100"
                      >
                        <td className="pl-4 py-4">{index + 1}</td>
                        <td className="pl-4 font-semibold">{user.userName}</td>
                        <td className="pl-4 font-semibold">{user.point}</td>
                        <td className="pl-4">{getDate(user.start_time)}</td>
                        <td className="pl-4">{getTime(user.start_time)}</td>
                        <td className="pl-4">
                          {user.end_time ? (
                            getTime(user.end_time)
                          ) : (
                            <span className="text-red-500 font-semibold">
                              Chưa nộp bài
                            </span>
                          )}
                        </td>
                        <td className="pl-4">
                          {user.end_time
                            ? getDistance(user.start_time, user.end_time)
                            : null}
                        </td>
                        <td className="pl-4 font-semibold text-primary-800">
                          <Link
                            to={`/tests/${topic_id}/statistic/detail?user_id=${user.userId}`}
                          >
                            Xem chi tiết
                          </Link>
                        </td>
                        <td className="pl-4">
                          <button onClick={() => requestDeleteUserExam(index)}>
                            <ToolTip title="Xóa">
                              <RiDeleteBin6Line className="text-red-500" />
                            </ToolTip>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default withBackTop(StatisticExam);
