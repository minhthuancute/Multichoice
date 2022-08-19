import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FilterTests from '../../../components/Tests/FilterTests';
import DefaultLayout from '../../../layouts/DefaultLayout';
import TestList from '../TestList/TestList';

const Tests: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const onFilter = (keyword: string) => {
    console.log(keyword);
    setSearchKeyword(keyword);
  };

  return (
    <DefaultLayout>
      <div className="wrapper-tests">
        <div className="test-header">
          <div className="container flex justify-between py-4">
            <h3 className="text-xl font-medium">Danh sách đề thi</h3>
            <Link
              to="/tests/create"
              className="create-test btn-primary rounded-md bg-primary-900 text-sm
            text-white font-bold flex justify-center items-center w-32 h-10"
            >
              Tạo đề thi
            </Link>
          </div>
        </div>

        <div className="test-body py-5 bg-slate-100 min-h-screen">
          <div className="container">
            <FilterTests onFilter={onFilter} />
            <TestList searchKeyword={searchKeyword} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Tests;
