import { IUserDoExamdetail } from '@monorepo/multichoice/dto';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/Commons/Breadcrumb/Breadcrumb';
import QuestionsUserExam from '../../../components/QuestionsUserExam/QuestionsUserExam';
import { getTopicTitle } from '../../../helper/getTopicTitle';
import { withBackTop } from '../../../HOCs/withBackTop';
import { useQuery } from '../../../hooks/useQuery';
import {
  examServices,
  IPayloadGetUserExamDetail,
} from '../../../services/ExamServices';
import { getDate, getTime } from '../../../utils/formatDate';

const StatisticUserExam: React.FC = () => {
  const { id: topic_id } = useParams();
  const topicId = Number(topic_id) || -1;

  const query = useQuery();

  const [userExamDetail, setUserExamDetail] = useState<IUserDoExamdetail>();
  const [topicTitle, setTopicTitle] = useState<string>('');

  const getStatisticUserDetail = async () => {
    try {
      const payload: IPayloadGetUserExamDetail = {
        topicId: topicId,
        userId: Number(query.get('user_id')) || -1,
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
    setTopicTitle(getTopicTitle(topicId));
    getStatisticUserDetail();
  }, []);

  if (!userExamDetail) return null;

  return (
    <div>
      <header className="container py-4">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/tests">Đề thi</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/tests/${topicId}/statistic`}>{topicTitle}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <div>Thống kê</div>
          </Breadcrumb.Item>
        </Breadcrumb>
      </header>
      <main
        className="bg-slate-50 pt-5"
        style={{
          minHeight: 'calc(100vh - 106px)',
        }}
      >
        <div className="container h-max pt-4 rounded-md pb-10">
          <div className="mb-10">
            <h4 className="text-primary-900 mb-2 font-semibold underline">
              Chi tiết:
            </h4>
            <ul
              className="relative border-b border-slate-200 last:border-none py-5 px-6 bg-white
              shadow-md last:mb-0 text-tiny text-slate-800"
            >
              <li className="capitalize">
                <span className="font-semibold mr-2">Tên:</span>
                {userExamDetail.userName}
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
            </ul>
          </div>
          <div>
            <h4 className="text-primary-900 mb-2 font-semibold underline">
              Danh sách câu hỏi:
            </h4>
            <QuestionsUserExam questions={userExamDetail?.questions || []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default withBackTop(StatisticUserExam);
