import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '../../hooks/useQuery';
import { topicServices } from '../../services/TopicServices';
import { topicStore } from '../../store/rootReducer';
import Breadcrumb from '../Commons/Breadcrumb/Breadcrumb';

interface HeaderCreateQuestionQuery {
  topic_id: string;
}

const HeaderCreateQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [query] = useQuery<HeaderCreateQuestionQuery>();
  const { setTopicDetailData, topicDetail } = topicStore();

  const getTopicDetail = async () => {
    try {
      const { data } = await topicServices.getTopicById(+query.topic_id);
      setTopicDetailData(data);
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getTopicDetail();
  }, []);

  return (
    <div className="container flex justify-between py-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={'/tests/edit/' + topicDetail.id}>{topicDetail.title}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={'/questions/create?topic_id=' + topicDetail.id}>
            Câu hỏi
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <div>Tạo mới câu hỏi</div>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="ctas flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="cancle-create mr-4 focus:outline-none focus:ring
        focus:ring-slate-200 rounded-md flex justify-center
         items-center w-24 h-10 text-sm text-slate-800 font-bold border border-solid border-slate-800"
        >
          Hủy
        </button>
        <button
          className="create-test btn-primary rounded-md flex justify-center items-center px-4 h-10 text-sm
        text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
          form="form-create-question"
        >
          Tạo mới câu hỏi
        </button>
      </div>
    </div>
  );
};

export default HeaderCreateQuestion;
