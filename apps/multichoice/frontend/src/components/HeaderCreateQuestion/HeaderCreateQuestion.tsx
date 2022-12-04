import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '../../hooks/useQuery';
import { topicServices } from '../../services/TopicServices';
import { topicStore } from '../../store/rootReducer';
import Breadcrumb from '../Commons/Breadcrumb/Breadcrumb';
import Button from '../Commons/Button/Button';

interface HeaderCreateQuestionQuery {
  topic_id: string;
}

const HeaderCreateQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [query] = useQuery<HeaderCreateQuestionQuery>();
  const { setTopicDetail, topicDetail } = topicStore();

  const getTopicDetail = async () => {
    try {
      const { data } = await topicServices.getTopicById(+query.topic_id);
      setTopicDetail(data);
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getTopicDetail();
  }, []);

  return (
    <div className="bg-white">
      <div className="container flex justify-between py-4 ">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={'/tests/edit/' + topicDetail.id}>
              {topicDetail.title}
            </Link>
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
        <div className="ctas flex items-center gap-x-2">
          <Button onClick={() => navigate(-1)}>Hủy</Button>
          <Button color="success" form="form-create-question">
            Tạo mới câu hỏi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderCreateQuestion;
