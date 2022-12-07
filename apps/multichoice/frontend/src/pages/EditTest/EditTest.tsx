import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderEditTest from '../../components/EditTest/HeaderEditTest';
import QuestionList from '../../components/QuestionList/QuestionList';
import { withBackTop } from '../../HOCs/withBackTop';
import { topicStore } from '../../store/rootReducer';

const EditTest: React.FC = () => {
  const { id } = useParams();
  const { getTopic } = topicStore();

  useEffect(() => {
    getTopic(Number(id));
  }, []);

  return (
    <div className="edit-test">
      <HeaderEditTest />

      <div className="pt-5 pb-10">
        <QuestionList />
      </div>
    </div>
  );
};

export default withBackTop(EditTest);
