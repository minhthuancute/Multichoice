import React from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout';

const PageNotfound: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mt-16">
        <div className="mx-auto bg-notfound bg-cover bg-no-repeat bg-center max-w-md h-40"></div>
        <div className="mt-5 text-center text-slate-900 text-sm">
          <p>Chúng tôi không tìm thấy trang bạn tìm kiếm</p>
          <p>
            Vui lòng kiểm tra lại đường dẫn hoặc quay lại
            <Link to="/tests" className="text-primary-900 ml-1">
              Trang chủ
            </Link>
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PageNotfound;
