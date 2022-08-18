import React, { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../../../layouts/DefaultLayout';
import { topicServices } from '../../../services/TopicServices';

const EditTest: React.FC = () => {
  const query = useParams();

  const getTopicDetail = async () => {
    const { id } = query;
    try {
      const { data } = await topicServices.getTopicById(id || '');
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    getTopicDetail();
  }, []);

  return (
    <DefaultLayout>
      <div className="edit-test"></div>
    </DefaultLayout>
  );
};

export default EditTest;
