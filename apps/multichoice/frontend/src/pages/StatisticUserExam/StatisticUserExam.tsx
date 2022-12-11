import { IUserDoExamDetail } from '@monorepo/multichoice/dto';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Commons/Breadcrumb/Breadcrumb';
import QuestionsUserExam from '../../components/QuestionsUserExam/QuestionsUserExam';
import { getTopicTitle } from '../../helper/getTopicTitle';
import { withBackTop } from '../../HOCs/withBackTop';
import { useQuery } from '../../hooks/useQuery';
import { examServices } from '../../services/Exam/ExamServices';
import { IPayloadGetUserExamDetail } from '../../services/Exam/type';
import { getDate, getDistance, getTime } from '../../utils/format_date';

interface IStatisticUserExamQuery {
  user_id: string;
}

const StatisticUserExam: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query] = useQuery<IStatisticUserExamQuery>();

  const [userExamDetail, setUserExamDetail] = useState<IUserDoExamDetail>();

  const getStatisticUserDetail = async () => {
    try {
      const payload: IPayloadGetUserExamDetail = {
        topicId: Number(id),
        userId: +query.user_id,
      };
      const { data } = await examServices.getUserExamDetail(payload);
      if (data) {
        const userExamDetail: IUserDoExamDetail = data.data;
        setUserExamDetail(userExamDetail);
      }
    } catch {
      navigate('/');
    }
  };

  useEffect(() => {
    getStatisticUserDetail();
  }, []);

  return userExamDetail ? (
    <div>
      <header className="container py-4">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/tests">Đề thi</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/tests/${Number(id)}/statistic`}>
              {getTopicTitle(Number(id))}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <div>Thống kê</div>
          </Breadcrumb.Item>
        </Breadcrumb>
      </header>
      <main>
        <div className="container h-max pt-4 rounded-md pb-10">
          <div className="mb-10">
            <h4 className="text-primary-900 mb-2 font-semibold">Chi tiết:</h4>
            <ul
              className="relative border-b border-slate-200 last:border-none py-5 px-6 bg-white
              shadow-md last:mb-0 text-tiny text-slate-800"
            >
              <li className="capitalize">
                <span className="font-semibold mr-2">Tên:</span>
                {userExamDetail.username || 'N/A'}
              </li>
              <li>
                <span className="font-semibold mr-2">Điểm:</span>
                {userExamDetail.point}
              </li>
              <li>
                <span className="font-semibold mr-2">Ngày:</span>
                {getDate(userExamDetail.startTime)}
              </li>
              <li>
                <span className="font-semibold mr-2">Thời gian bắt đầu:</span>
                {getTime(userExamDetail.startTime)}
              </li>
              <li>
                <span className="font-semibold mr-2">Thời gian kết thúc:</span>
                {userExamDetail.endTime ? (
                  getTime(userExamDetail.endTime)
                ) : (
                  <span className="text-red-500 font-semibold">
                    Chưa nộp bài
                  </span>
                )}
              </li>
              <li>
                <span className="font-semibold mr-2">Thời gian làm bài:</span>
                {getDistance(userExamDetail.startTime, userExamDetail.endTime)}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-primary-900 mb-2 font-semibold">
              Danh sách câu hỏi:
            </h4>
            <QuestionsUserExam questions={userExamDetail?.questions || []} />
          </div>
        </div>
      </main>
    </div>
  ) : null;
};

export default withBackTop(StatisticUserExam);
