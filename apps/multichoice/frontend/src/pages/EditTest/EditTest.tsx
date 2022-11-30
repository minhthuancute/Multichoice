import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderEditTest from '../../components/EditTest/HeaderEditTest';
import QuestionList from '../../components/QuestionList/QuestionList';
import { withBackTop } from '../../HOCs/withBackTop';
import { topicServices } from '../../services/TopicServices';
import { topicStore } from '../../store/rootReducer';
import { ITopicDetailResponse } from '../../types';

const EditTest: React.FC = () => {
  const query = useParams();
  const navigate = useNavigate();
  const { setTopicDetailData } = topicStore();

  const getTopicDetail = async () => {
    const { id } = query;
    try {
      const { data } = await topicServices.getTopicById(Number(id));
      setTopicDetailData(data);
    } catch {
      navigate('/');
    }
  };

  useEffect(() => {
    getTopicDetail();
    return () => {
      setTopicDetailData({} as ITopicDetailResponse);
    };
  }, []);

  return (
    <div className="edit-test">
      <HeaderEditTest />

      <div
        className="pt-5 pb-10 bg-slate-100"
        style={{
          minHeight: 'calc(100vh - 228px)',
        }}
      >
        <QuestionList />
      </div>
    </div>
  );
};

export default withBackTop(EditTest);
