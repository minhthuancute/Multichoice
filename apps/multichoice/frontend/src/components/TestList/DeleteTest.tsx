import React from 'react';
import { iNotification } from 'react-notifications-component';
import { useNavigate } from 'react-router-dom';
import { deleteTopicSuccess } from '../../constants/msgNotify';
import { notify } from '../../helper/notify';
import { topicServices } from '../../services/Title/TopicServices';
import Button from '../Commons/Button/Button';
import Modal from '../Commons/Modal/Modal';

interface IDeleteTestProps {
  testID: number;
  testTitle: string;
  visibleModal: boolean;
  setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmDelete: () => void;
}

const DeleteTest: React.FC<IDeleteTestProps> = ({
  testID,
  testTitle,
  visibleModal,
  setVisibleModal,
  onConfirmDelete,
}) => {
  const navigate = useNavigate();

  const deleteTest = async () => {
    try {
      const { status } = await topicServices.deleteTopicById(testID);
      if (status === 200) {
        notify({
          message: deleteTopicSuccess,
        } as iNotification);
        onConfirmDelete();
      }
    } catch {
      navigate('/');
    }
  };

  return (
    <Modal
      headerTitle="Xoá bỏ đề thi"
      visible={visibleModal}
      setVisibleModal={setVisibleModal}
      placement="CENTER"
    >
      <>
        <div className="header">
          <h4 className="text-slate-800">
            Bạn có chắc chắn muốn xóa bỏ đề thi:{' '}
            <span className="font-semibold">{testTitle}</span> ?
          </h4>
        </div>
        <div className="body ctas flex items-center justify-end gap-x-2 mt-6">
          <Button onClick={() => setVisibleModal(false)}>Huỷ</Button>
          <Button onClick={() => deleteTest()} color="success">
            Xác nhận
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default DeleteTest;
