import React from 'react';
import { ITestRealtimeRecord } from '../../types/Commons';
import { fireGet, fireUpdate } from '../../utils/firebase_utils';
import Button from '../Commons/Button/Button';
import Modal from '../Commons/Modal/Modal';

interface IPlayTestRealtimeProps {
  visibleModal: boolean;
  setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
  topicUrl: string;
  topicTitle: string;
  isPlaytest: boolean;
}

const PlayTestRealtime: React.FC<IPlayTestRealtimeProps> = ({
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
      headerTitle={isPlaytest ? 'Bắt đầu bài thi' : 'Tạm dừng bài thi'}
      visible={visibleModal}
      setVisibleModal={setVisibleModal}
      size="sm"
      placement="CENTER"
    >
      <>
        <div>
          <p className="text-slate-800">
            Bạn có chắc chắn muốn {isPlaytest ? 'bắt đầu' : 'tạm dừng'} bài thi:{' '}
            {topicTitle}?
          </p>
        </div>
        <div className="ctas flex items-center justify-end gap-x-2 mt-6">
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

export default PlayTestRealtime;
