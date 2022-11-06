import React from 'react';
import { ITestRealtimeRecord } from '../../types/ICommons';
import { fireGet, fireUpdate } from '../../utils/firebase_utils';
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
  const testPath: string = 'test-' + topicUrl;

  const handleStartTest = () => {
    const recordData: ITestRealtimeRecord = {
      started: true,
      startTime: new Date().getTime(),
    };
    fireUpdate(testPath, recordData);
  };

  const handlePauseTest = () => {
    let record: ITestRealtimeRecord = {} as ITestRealtimeRecord,
      duration = 0;
    fireGet(testPath, (data: any) => {
      record = data;
    });

    const recordData: ITestRealtimeRecord = {
      started: false,
      startTime: record.startTime,
    };

    duration =
      (Number(record?.duration) || 0) +
      +(new Date().getTime() - +record?.startTime);
    recordData.duration = duration;
    fireUpdate(testPath, recordData);
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
            <h4 className="text-slate-800 font-semibold text-xl capitalize">
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
              onClick={() => {
                if (isPlaytest) {
                  handleStartTest();
                } else {
                  handlePauseTest();
                }
                setOpenModal(false);
              }}
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
