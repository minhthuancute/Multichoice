import React from 'react';
import { ITestRealtimeRecord } from '../../types/ICommons';
import { fireGet, fireUpdate } from '../../utils/firebase_utils';
import Button from '../Commons/Button/Button';
import Modal from '../Commons/Modal/Modal';

interface IHandlelayTestProps {
  visibleModal: boolean;
  setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
  topicUrl: string;
  topicTitle: string;
  isPlaytest: boolean;
}

const HandlelayTest: React.FC<IHandlelayTestProps> = ({
  visibleModal,
  setVisibleModal,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <Modal
      visible={visibleModal}
      setVisibleModal={setVisibleModal}
      size="sm"
      placement="CENTER"
    >
      <>
        <div className="header text-center">
          <h4 className="text-slate-800 font-semibold text-xl capitalize">
            {isPlaytest ? 'Bắt đầu bài thi' : 'Tạm dừng bài thi'}
          </h4>

          <p className="mt-4 text-slate-800">
            Bạn có chắc chắn muốn {isPlaytest ? 'bắt đầu' : 'tạm dừng'} bài thi:{' '}
            <span className="font-semibold">{topicTitle}</span>?
          </p>
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-5">
          <Button type="button" onClick={() => setVisibleModal(false)}>
            Huỷ
          </Button>
          <Button
            type="button"
            color="success"
            onClick={() => {
              if (isPlaytest) {
                handleStartTest();
              } else {
                handlePauseTest();
              }
              setVisibleModal(false);
            }}
          >
            {isPlaytest ? 'Bắt đầu' : 'Tạm dừng'}
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default HandlelayTest;
