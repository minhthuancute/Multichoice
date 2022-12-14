import { IUserDoExam } from '@monorepo/multichoice/dto';
import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { iNotification } from 'react-notifications-component';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Commons/Breadcrumb/Breadcrumb';
import ToolTip from '../../components/Commons/ToolTip/ToolTip';
import { notify } from '../../helper/notify';
import { examServices } from '../../services/Exam/ExamServices';
import { getDate, getDistance, getTime } from '../../utils/format_date';
import ConfirmDeleteUserExam from '../../components/Exam/ConfirmDeleteUserExam';
import { getTopicTitle } from '../../helper/getTopicTitle';
import FilterStatisticExam from '../../components/Exam/FilterStatisticExam';
import { withBackTop } from '../../HOCs/withBackTop';
import { deleteResultUserExamSuccess } from '../../constants/msgNotify';
import {
  IPayloadDeleteUserExam,
  IPayloadgetListExamByTopicId,
} from '../../services/Exam/type';
import EmptyData from '../../components/Commons/EmptyData/EmptyData';

const StatisticExam: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usersDoExam, setUsersDoExam] = useState<IUserDoExam[]>([]);
  const [visibleModalDelete, setVisibleModalDelete] = useState<boolean>(false);
  const [userExamDetail, setUserExamDetail] = useState<IUserDoExam>();

  const getListExamByTopicId = async () => {
    try {
      const payload: IPayloadgetListExamByTopicId = {
        topicID: Number(id),
      };
      const { data, status } = await examServices.getListExamByTopicId(payload);
      if (status === 200) {
        setUsersDoExam(data.data);
      }
    } catch {
      navigate('/');
    }
  };

  const handleDeleteUserExam = async () => {
    try {
      const payload: IPayloadDeleteUserExam = {
        userId: Number(userExamDetail?.userID),
      };
      const response = await examServices.deleteUserExam(payload);
      if (response) {
        const { status } = response;
        if (status) {
          setVisibleModalDelete(false);
          notify({
            message: deleteResultUserExamSuccess,
          } as iNotification);
          getListExamByTopicId();
        }
      }
    } catch (error) {
      //
    }
  };

  const onclickDeleteUserExam = (rowIndex: number) => {
    setVisibleModalDelete(true);
    setUserExamDetail(usersDoExam[rowIndex]);
  };

  useEffect(() => {
    getListExamByTopicId();
  }, []);

  return (
    <>
      <div className="bg-white">
        <header className="container py-4">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/tests">Đề thi</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <div>Thống kê đề thi: {getTopicTitle(Number(id))}</div>
            </Breadcrumb.Item>
          </Breadcrumb>
        </header>
      </div>

      <main className="pb-10">
        <ConfirmDeleteUserExam
          userData={userExamDetail || ({} as IUserDoExam)}
          onConfirmDelete={handleDeleteUserExam}
          setVisibleModal={setVisibleModalDelete}
          visibleModal={visibleModalDelete}
        />

        <div className="container">
          <div>
            {usersDoExam && usersDoExam.length ? (
              <>
                <div className="flex justify-end mb-4">
                  <FilterStatisticExam />
                </div>
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
                      <th className="py-2 pl-4 text-left capitalize">
                        Chi tiết
                      </th>
                      <th className="py-2 pl-4 text-left capitalize">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="py-4">
                    {usersDoExam.length &&
                      usersDoExam.map((user: IUserDoExam, index: number) => (
                        <tr
                          key={user.startTime + user.username}
                          className="mb-4 border-b border-slate-200 last:border-none
                        text-slate-800 text-sm cursor-pointer odd:bg-white even:bg-slate-100"
                        >
                          <td className="pl-4 py-4">{index + 1}</td>
                          <td className="pl-4 font-semibold">
                            {user.username || 'N/A'}
                          </td>
                          <td className="pl-4 font-semibold text-green-500">
                            {user.point}
                          </td>
                          <td className="pl-4">{getDate(user.startTime)}</td>
                          <td className="pl-4">{getTime(user.startTime)}</td>
                          <td className="pl-4">
                            {user.endTime ? (
                              getTime(user.endTime)
                            ) : (
                              <span className="text-red-500 font-semibold">
                                Chưa nộp bài
                              </span>
                            )}
                          </td>
                          <td className="pl-4">
                            {user.endTime
                              ? getDistance(user.startTime, user.endTime)
                              : null}
                          </td>
                          <td className="pl-4 font-semibold text-primary-800">
                            <Link
                              to={`/manage-tests/${id}/statistic/detail?user_id=${user.userID}`}
                            >
                              Xem chi tiết
                            </Link>
                          </td>
                          <td className="pl-4">
                            <button
                              onClick={() => onclickDeleteUserExam(index)}
                            >
                              <ToolTip title="Xóa">
                                <RiDeleteBin6Line className="text-red-500" />
                              </ToolTip>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            ) : (
              <EmptyData>
                Hiện chưa có kết quả thống kê nào cho đề thi này !
              </EmptyData>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default withBackTop(StatisticExam);
