import React, { useEffect } from 'react';
import FilterTests from '../../components/FilterTests/FilterTests';
import TestList from '../../components/TestList/TestList';
import { withBackTop } from '../../HOCs/withBackTop';
import { topicStore } from '../../store/Topic/topicStore';

const Test: React.FC = () => {
  const { setPublicStatus } = topicStore();

  useEffect(() => {
    setPublicStatus(true);
  }, []);

  return (
    <>
      <div className="test-header bg-white">
        <div className="container flex items-center justify-between py-4">
          <h3 className="text-xl font-semibold leading-none">
            Danh sách đề thi
          </h3>
          <div className="w-2/5">
            <FilterTests />
          </div>
        </div>
      </div>

      <div className="test-body pt-5 pb-10">
        <div className="container">
          <TestList />
        </div>
      </div>
    </>
  );
};

export default withBackTop(Test);
