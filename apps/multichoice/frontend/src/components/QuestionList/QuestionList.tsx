import React from 'react';
import { topicStore } from '../../store/rootReducer';
import { IQuestion } from '../../types';
import QuestionItem from '../QuestionItem/QuestionItem';

const QuestionList: React.FC = () => {
  const { topic } = topicStore();

  return (
    <div>
      {topic.questions &&
        topic.questions.map((question: IQuestion) => {
          return <QuestionItem question={question} />;
        })}
    </div>
  );
};

export default QuestionList;
