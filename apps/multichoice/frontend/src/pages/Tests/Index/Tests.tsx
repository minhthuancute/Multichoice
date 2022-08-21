import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterTests from '../../../components/Tests/FilterTests';
import TestList from '../../../components/TestList/TestList';

const Tests: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // on search Test
  const onFilter = (keyword: string) => {
    console.log(keyword);
    setSearchKeyword(keyword);
    setSearchParams('?search=' + keyword);
  };

  return (
    <div className="wrapper-tests">
      <div className="test-header">
        <div className="container flex items-center justify-between py-4">
          <h3 className="text-xl font-semibold leading-none">
            Danh sách đề thi
          </h3>
          <Link
            to="/tests/create"
            className="create-test btn-primary rounded-md bg-primary-900 text-sm
            text-white font-bold flex justify-center items-center w-32 h-10 transition-all
              duration-200 hover:bg-primary-800
            "
          >
            Tạo đề thi
          </Link>
        </div>
      </div>

      <div className="content-page test-body py-5 bg-slate-100">
        <div className="container">
          <FilterTests onFilter={onFilter} />
          <TestList searchKeyword={searchKeyword} />
        </div>
      </div>
    </div>
  );
};

export default Tests;
