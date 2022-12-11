import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EmptyData from '../../components/Commons/EmptyData/EmptyData';
import HeaderEditTest from '../../components/HeaderEditTest/HeaderEditTest';
import QuestionList from '../../components/QuestionList/QuestionList';
import { validObject } from '../../helper/validObject';
import { withBackTop } from '../../HOCs/withBackTop';
import { topicStore } from '../../store/rootReducer';

const EditTest: React.FC = () => {
  const { id } = useParams();
  const { topic, getTopic } = topicStore();

  useEffect(() => {
    getTopic(Number(id));
  }, []);

  return (
    <div className="edit-test">
      <HeaderEditTest />

      {validObject(topic.questions) ? (
        <div className="pt-5 pb-10">
          <QuestionList />
        </div>
      ) : (
        <EmptyData>Bộ đề chưa có câu hỏi nào!</EmptyData>
      )}
    </div>
  );
};

export default withBackTop(EditTest);
