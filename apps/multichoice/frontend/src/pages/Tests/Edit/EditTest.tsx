import React, { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderEditTest from '../../../components/EditTest/HeaderEditTest';
import QuestionList from '../../../components/QuestionList/QuestionList';
import { topicServices } from '../../../services/TopicServices';
import { topicStore } from '../../../store/rootReducer';

const EditTest: React.FC = () => {
  const query = useParams();
  const { setTopicData } = topicStore();

  const getTopicDetail = async () => {
    const { id } = query;
    try {
      const { data } = await topicServices.getTopicById(id || '');
      setTopicData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
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

export default EditTest;
