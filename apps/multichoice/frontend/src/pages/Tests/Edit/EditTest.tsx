import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderEditTest from '../../../components/EditTest/HeaderEditTest';
import QuestionList from '../../../components/QuestionList/QuestionList';
import { withBackTop } from '../../../HOCs/withBackTop';
import { topicServices } from '../../../services/TopicServices';
import { topicStore } from '../../../store/rootReducer';

const EditTest: React.FC = () => {
  const query = useParams();
  const { setTopicDetailData } = topicStore();

  const getTopicDetail = async () => {
    const { id } = query;
    try {
      const { data } = await topicServices.getTopicById(Number(id));
      setTopicDetailData(data);
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getTopicDetail();
  }, []);

  return (
    <div className="edit-test">
      <HeaderEditTest />

      <div className="content-page pt-5 pb-10 bg-slate-100">
        <QuestionList />
      </div>
    </div>
  );
};

export default withBackTop(EditTest);
