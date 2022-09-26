import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { iNotification } from 'react-notifications-component';
import { notify } from '../../helper/notify';
import { topicServices } from '../../services/TopicServices';
import Modal from '../Modal/Modal';

interface IDeleteTest {
  openModalDelete: boolean;
  testID: number;
  testTitle: string;
  setOpenModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  cbConfirmDel: () => void;
}

const DeleteTest: React.FC<IDeleteTest> = ({
  testID,
  testTitle,
  openModalDelete,
  setOpenModalDelete,
  cbConfirmDel,
}) => {
  const deleteTopic = async () => {
    try {
      const { data, status } = await topicServices.deleteTopicById(testID);
      if (status === 200) {
        notify({
          message: 'Xóa đề thi thành công !',
        } as iNotification);
        cbConfirmDel();
      }
    } catch (error) {
      //
    }
  };

  return (
    <Modal openModal={openModalDelete} setOpenModal={setOpenModalDelete}>
      <div className="modal-content mx-auto mt-10 px-5 flex flex-col justify-center bg-white rounded-md max-w-lg w-full h-60">
        <div className="header text-center">
          <RiErrorWarningLine className="text-red-600 text-5xl mx-auto" />
          <h4 className="mt-4 text-slate-800 text-tiny">
            Bạn có chắc chắn muốn xóa bỏ đề thi:{' '}
            <span className="font-semibold">{testTitle}</span> ?
          </h4>
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-12">
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
            onClick={() => deleteTopic()}
          >
            Xác nhận
          </button>

          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-slate-800 font-bold border border-solid border-slate-800"
            onClick={() => setOpenModalDelete(false)}
          >
            Huỷ
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTest;
