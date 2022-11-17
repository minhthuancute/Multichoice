import React, { useEffect, useState } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { iNotification } from 'react-notifications-component';
import { useParams } from 'react-router-dom';
import { deleteQuestionSuccess } from '../../constants/msgNotify';
import { notify } from '../../helper/notify';
import { questionServices } from '../../services/QuestionServices';
import { topicServices } from '../../services/TopicServices';
import { topicStore } from '../../store/rootReducer';
import { IQuestion } from '../../types';
import Modal from '../Modal/Modal';
import PolaCode from '../PolaCode/PolaCode';
import QuestionItem from '../QuestionItem/QuestionItem';

const QuestionList: React.FC = () => {
  const query = useParams();
  const { topicDetail, setTopicDetailData } = topicStore();

  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [questionDel, setQuestionDel] = useState<IQuestion>();

  const handleDeleteQuestion = (question: IQuestion) => {
    setQuestionDel(question);
    setOpenModalDelete(true);
  };

  const getTopicDetail = async () => {
    const { id } = query;
    try {
      const { data } = await topicServices.getTopicById(Number(id));
      setTopicDetailData(data);
    } catch {
      //
    }
  };

  const deleteQuestion = async (questionId = -1) => {
    try {
      const { data } = await questionServices.deleteQuestion(questionId);
      if (data.success) {
        notify({
          message: deleteQuestionSuccess,
          type: 'success',
        } as iNotification);

        setOpenModalDelete(false);
        // getTopicDetail();
      }
    } catch (error) {
      notify({
        message: 'Something went wrong !',
        type: 'danger',
      } as iNotification);
      setOpenModalDelete(false);
    }
  };

  useEffect(() => {
    // getTopicDetail();
  }, []);

  return (
    <div>
      <Modal
        openModal={openModalDelete}
        setOpenModal={setOpenModalDelete}
        placement="CENTER"
        size="sm"
      >
        <div
          className="modal-content mx-auto flex flex-col justify-center
        bg-white rounded-md max-w-lg w-full py-8"
        >
          <div className="header text-center">
            <h4 className="text-slate-800 text-tiny flex justify-center">
              Bạn có chắc chắn muốn xóa bỏ câu hỏi:{' '}
              <PolaCode
                content={questionDel?.content || ''}
                className="ml-2 font-semibold"
              />
              ?
            </h4>
          </div>
          <div className="body ctas flex items-center justify-center gap-x-2 mt-12">
            <button
              className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-slate-800 font-bold border border-solid border-slate-800"
              onClick={() => setOpenModalDelete(false)}
            >
              Huỷ
            </button>
            <button
              className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
              onClick={() => deleteQuestion(questionDel?.id)}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      {topicDetail.questions &&
        topicDetail.questions.map((question: IQuestion, index: number) => {
          return (
            <QuestionItem
              handleDeleteQuestion={handleDeleteQuestion}
              question={question}
              index={index + 1}
              key={question.id}
            />
          );
        })}
    </div>
  );
};

export default QuestionList;
