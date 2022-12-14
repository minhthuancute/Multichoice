import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../Commons/Breadcrumb/Breadcrumb';
import Button from '../Commons/Button/Button';

const HeaderCreateTest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div className="container flex justify-between py-4">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/manage-tests">Đề thi</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <div>Tạo mới đề thi</div>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="ctas flex items-center gap-x-2">
          <Button type="button" onClick={() => navigate('/tests')}>
            Hủy
          </Button>
          <Button color="success" type="submit" form="form-create-test">
            Tạo mới
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderCreateTest;
