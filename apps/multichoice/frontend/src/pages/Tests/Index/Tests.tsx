import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../../components/Modal/Modal';
import FilterTests from '../../../components/Tests/FilterTests';
import DefaultLayout from '../../../layouts/DefaultLayout';
import { titleServices } from '../../../services/TitleServices';

const Tests: React.FC = () => {
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);

  useLayoutEffect(() => {
    titleServices.addSub('Tests');
  }, []);

  const showModalCreateTest = () => {
    setShowModalCreate((state) => !state);
  };

  return (
    <DefaultLayout>
      <div className="wrapper-tests">
        <Modal openModal={showModalCreate}>
          <div>
            hihi
            <button onClick={() => setShowModalCreate(false)}>Close</button>
          </div>
        </Modal>
        <div className="test-header">
          <div className="container flex justify-between py-4">
            <h3 className="text-2xl font-semibold">Danh sách đề thi</h3>
            <Link
              to="/tests/create"
              className="create-test btn-primary rounded-md bg-primary px-4 py-2 text-sm
            text-white font-bold"
              onClick={() => showModalCreateTest()}
            >
              Tạo đề thi
            </Link>
          </div>
        </div>

        <div className="test-body container mt-4">
          <FilterTests />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Tests;
