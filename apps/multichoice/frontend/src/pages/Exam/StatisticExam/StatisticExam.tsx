import { IUserDoExam, UserExamDto } from '@monorepo/multichoice/dto';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../components/Commons/Breadcrumb/Breadcrumb';
import { useQuery } from '../../../hooks/useQuery';
import {
  examServices,
  IPayloadgetListExamByTopicId,
} from '../../../services/ExamServices';
import { getDate, getDistance, getTime } from '../../../utils/formatDate';

const StatisticExam: React.FC = () => {
  const query = useQuery();
  const topicId = query.get('topic_id') || -1;

  const [usersDoExam, setUsersDoExam] = useState<IUserDoExam[]>([]);

  const getListExamByTopicId = async () => {
    try {
      const payload: IPayloadgetListExamByTopicId = {
        topicID: +topicId,
      };
      const { data, status } = await examServices.getListExamByTopicId(payload);
      if (status === 200) {
        setUsersDoExam(data.data);
      }
    } catch (error) {
      //
    }
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
        <div className="container">
          <div className=" content-page pt-5 pb-10">
            <table className="shadow-xl w-full">
              <thead className="bg-slate-800 text-white text-tiny">
                <tr>
                  <th className="py-2 pl-4 text-left capitalize">Stt</th>
                  <th className="py-2 pl-4 text-left capitalize">
                    Tên người thi
                  </th>
                  <th className="py-2 pl-4 text-left capitalize">Ngày</th>
                  <th className="py-2 pl-4 text-left capitalize">
                    Thời gian bắt đầu
                  </th>
                  <th className="py-2 pl-4 text-left capitalize">
                    Thời gian kết thúc
                  </th>
                  {/* <th className="py-2 pl-4 text-left capitalize">
                  Thời gian làm bài
                </th> */}
                  <th className="py-2 pl-4 text-left capitalize">Điểm</th>
                </tr>
              </thead>

              <tbody className="py-4">
                {usersDoExam.length &&
                  usersDoExam.map((user: IUserDoExam, index: number) => (
                    <tr
                      key={user.start_time + user.userName}
                      className="mb-4 border-b border-slate-200 last:border-none
                    text-slate-800 text-sm"
                    >
                      <td className="pl-4 py-4">{index + 1}</td>
                      <td className="pl-4 font-semibold">{user.userName}</td>
                      <td className="pl-4">{getDate(user.start_time)}</td>
                      <td className="pl-4">{getTime(user.start_time)}</td>
                      <td className="pl-4">{getTime(user.end_time)}</td>
                      {/* <td className="pl-4">
                      {getDistance(user.end_time, user.start_time)}
                    </td> */}
                      <td className="pl-4 font-semibold">{user.point}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatisticExam;
