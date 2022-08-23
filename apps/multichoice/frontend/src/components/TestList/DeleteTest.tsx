import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
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
      const { data } = await topicServices.deleteTopicById(testID);
      console.log(data);
      cbConfirmDel();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Modal openModal={openModalDelete}>
        <div className="modal-content px-5 flex flex-col justify-center bg-white rounded-md max-w-lg w-full h-80">
          <div className="header text-center">
            <RiErrorWarningLine className="text-red-600 text-5xl mx-auto" />
            <h4 className="mt-4 text-slate-800">
              Bạn có chắc chắn muốn bỏ đề thi:{' '}
              <span className="text-blue-600 font-semibold">{testTitle}</span> ?
            </h4>
          </div>
          <div className="body ctas flex items-center justify-center gap-x-2 mt-8">
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
    </div>
  );
};

export default DeleteTest;
