import React, { useState } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { iNotification } from 'react-notifications-component';
import { useParams } from 'react-router-dom';
import { notify } from '../../helper/notify';
import { questionServices } from '../../services/QuestionServices';
import { topicServices } from '../../services/TopicServices';
import { topicStore } from '../../store/rootReducer';
import { IQuestion } from '../../types';
import Modal from '../Modal/Modal';
import QuestionItem from '../QuestionItem/QuestionItem';

const QuestionList: React.FC = () => {
  const query = useParams();
  const { topic, setTopicData } = topicStore();

  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [questionDel, setQuestionDel] = useState<IQuestion>();

  const handleDeleteQuestion = (question: IQuestion) => {
    setQuestionDel(question);
    setOpenModalDelete(true);
    console.log(question);
  };

  const getTopicDetail = async () => {
    const { id } = query;
    try {
      const { data } = await topicServices.getTopicById(id || '');
      setTopicData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteQuestion = async (questionId = -1) => {
    try {
      const data = await questionServices.deleteQuestion(questionId);
      console.log(data);
      if (data.status === 200) {
        notify({
          message: 'Delete question succesfully !',
          type: 'success',
        } as iNotification);

        setOpenModalDelete(false);
        getTopicDetail();
      }
    } catch (error) {
      notify({
        message: 'Something went wrong !',
        type: 'danger',
      } as iNotification);
      setOpenModalDelete(false);
    }
  };

  return (
    <div>
      <Modal openModal={openModalDelete}>
        <div className="modal-content mt-10 mx-auto px-5 flex flex-col justify-center bg-white rounded-md max-w-lg w-full h-60">
          <div className="header text-center">
            <RiErrorWarningLine className="text-red-600 text-5xl mx-auto" />
            <h4 className="mt-4 text-slate-800 text-tiny">
              Bạn có chắc chắn muốn xóa bỏ câu hỏi:{' '}
              <span className="font-semibold">{questionDel?.content}</span> ?
            </h4>
          </div>
          <div className="body ctas flex items-center justify-center gap-x-2 mt-12">
            <button
              className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
        text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
              onClick={() => deleteQuestion(questionDel?.id)}
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

      {topic.questions &&
        topic.questions.map((question: IQuestion, index: number) => {
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
