import React from 'react';
import { ITestRealtimeRecord } from '../../types/ICommons';
import { fireSet } from '../../utils/firebase_utils';
import Modal from '../Modal/Modal';

interface IHandlelayTestProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  topicUrl: string;
  topicTitle: string;
  isPlaytest: boolean;
}

const HandlelayTest: React.FC<IHandlelayTestProps> = ({
  openModal,
  setOpenModal,
  topicUrl,
  topicTitle,
  isPlaytest,
}) => {
  // play or pause Test
  const handlePlayRealtimeTest = () => {
    //  path in FIrebase DB
    const testPath: string = 'test-' + topicUrl;
    const recordData: ITestRealtimeRecord = {
      start: isPlaytest,
      time: new Date().getTime(),
    };
    fireSet(testPath, recordData);
    setOpenModal(false);
  };

  return (
    <div>
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        size="sm"
        placement="CENTER"
      >
        <div
          className="modal-content px-5 flex flex-col justify-center
 bg-white rounded-md py-8"
        >
          <div className="header text-center">
            <h4 className="mt-4 text-slate-800 font-semibold text-2xl">
              {isPlaytest ? 'Bắt đầu bài thi' : 'Tạm dừng bài thi'}
            </h4>

            <p className="mt-4 text-slate-800">
              Bạn có chắc chắn muốn {isPlaytest ? 'bắt đầu' : 'tạm dừng'} bài
              thi: <span className="font-semibold">{topicTitle}</span>?
            </p>
          </div>
          <div className="body ctas flex items-center justify-center gap-x-2 mt-5">
            <button
              className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
    text-slate-800 font-bold border border-solid border-slate-800 focus:ring focus:ring-slate-100"
              onClick={() => setOpenModal(false)}
            >
              Huỷ
            </button>
            <button
              className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
    text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
              onClick={() => handlePlayRealtimeTest()}
            >
              {isPlaytest ? 'Bắt đầu' : 'Tạm dừng'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HandlelayTest;
