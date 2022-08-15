import React, { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import FilterTests from '../../components/Tests/FilterTests';
import DefaultLayout from '../../layouts/DefaultLayout';
import './test.scss';

const Tests: React.FC = () => {
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);

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
            <button
              className="create-test rounded-md bg-primary px-4 py-2 text-sm
            text-white font-bold"
              onClick={() => showModalCreateTest()}
            >
              Tạo đề thi
            </button>
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
