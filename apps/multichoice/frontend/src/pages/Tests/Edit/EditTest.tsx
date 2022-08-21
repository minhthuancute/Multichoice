import React, { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderEditTest from '../../../components/EditTest/HeaderEditTest';
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
    <div className="edit-test">
      <HeaderEditTest />

      <div className="content-page py-5 bg-slate-100"></div>
    </div>
  );
};

export default EditTest;
