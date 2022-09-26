import { IUserDoExam } from '@monorepo/multichoice/dto';
import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { iNotification } from 'react-notifications-component';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/Commons/Breadcrumb/Breadcrumb';
import ToolTip from '../../../components/Commons/ToolTip/ToolTip';
import Modal from '../../../components/Modal/Modal';
import { notify } from '../../../helper/notify';
import {
  examServices,
  IPayloadDeleteUserExam,
  IPayloadgetListExamByTopicId,
} from '../../../services/ExamServices';
import { getDate, getTime } from '../../../utils/formatDate';
import ConfirmDeleteUserExam from './ConfirmDeleteUserExam';
import StatisticUserExam from './StatisticUserExam';

const StatisticExam: React.FC = () => {
  const { id: topic_id } = useParams();

  const [usersDoExam, setUsersDoExam] = useState<IUserDoExam[]>([]);
  const [showModalUserExamDetail, setShowModalUserExamDetail] =
    useState<boolean>(false);
  const [showModalConfirmDelete, setShowModalConfirmDelete] =
    useState<boolean>(false);
  const [userExamDetail, setUserExamDetail] = useState<IUserDoExam>();

  const getListExamByTopicId = async () => {
    try {
      const payload: IPayloadgetListExamByTopicId = {
        topicID: Number(topic_id) || -1,
      };
      const { data, status } = await examServices.getListExamByTopicId(payload);
      if (status === 200) {
        setUsersDoExam(data.data);
      }
    } catch (error) {
      //
    }
  };

  const showUserExamDetail = (rowIndex: number) => {
    setShowModalUserExamDetail(true);
    setUserExamDetail(usersDoExam[rowIndex]);
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
            <div>Thống kê</div>
          </Breadcrumb.Item>
        </Breadcrumb>
      </header>
      <main>
        <Modal
          openModal={showModalUserExamDetail}
          setOpenModal={setShowModalUserExamDetail}
        >
          <StatisticUserExam
            setShowModalUserExamDetail={setShowModalUserExamDetail}
            userData={userExamDetail || ({} as IUserDoExam)}
          />
        </Modal>
        <ConfirmDeleteUserExam
          userData={userExamDetail || ({} as IUserDoExam)}
          onConfirmDelete={handleDeleteUserExam}
          setOpenModalConfirm={setShowModalConfirmDelete}
          openModalConfirm={showModalConfirmDelete}
        />

        <div className="container">
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
                    <th className="py-2 pl-4 text-left capitalize">Chi tiết</th>
                    <th className="py-2 pl-4 text-left capitalize">Action</th>
                    {/* <th className="py-2 pl-4 text-left capitalize">
                  Thời gian làm bài
                </th> */}
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
                        <td
                          className="pl-4 font-semibold text-primary-800"
                          onClick={() => showUserExamDetail(index)}
                        >
                          Xem chi tiết
                        </td>
                        <td className="pl-4">
                          <button onClick={() => requestDeleteUserExam(index)}>
                            <ToolTip title="Xóa">
                              <RiDeleteBin6Line className="text-red-500" />
                            </ToolTip>
                          </button>
                        </td>

                        {/* <td className="pl-4">
                      {getDistance(user.end_time, user.start_time)}
                    </td> */}
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

export default StatisticExam;
