import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FilterTests from '../../components/FilterTests/FilterTests';
import TestList from '../../components/TestList/TestList';
import { withBackTop } from '../../HOCs/withBackTop';
import { topicStore } from '../../store/Topic/topicStore';

const ManageTests: React.FC = () => {
  const { setPublicStatus } = topicStore();

  useEffect(() => {
    setPublicStatus(false);
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
          <div className="flex justify-end">
            <Link
              to="/manage-tests/create"
              className="create-test btn-success rounded-md bg-primary-900 text-sm
            text-white font-bold flex justify-center items-center w-32 h-10 transition-all
              duration-200"
            >
              Tạo đề thi
            </Link>
          </div>
          <TestList />
        </div>
      </div>
    </>
  );
};

export default withBackTop(ManageTests);
