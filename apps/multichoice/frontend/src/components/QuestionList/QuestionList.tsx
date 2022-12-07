import React, { useState } from 'react';
import { iNotification } from 'react-notifications-component';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteQuestionSuccess } from '../../constants/msgNotify';
import { notify } from '../../helper/notify';
import { questionServices } from '../../services/Question/QuestionServices';
import { topicServices } from '../../services/Title/TopicServices';
import { topicStore } from '../../store/rootReducer';
import { IQuestion } from '../../types';
import ModalConfirm from '../Commons/ModalConfirm/ModalConfirm';
import Modal from '../Commons/Modal/Modal';
import PolaCode from '../Commons/PolaCode/PolaCode';
import QuestionItem from '../QuestionItem/QuestionItem';
import UpdateQuestion from '../UpdateQuestion/UpdateQuestion';

const QuestionList: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { topic, getTopic } = topicStore();

  const [visibleModalDelete, setVisibleModalDelete] = useState<boolean>(false);
  const [visibleModalUpdate, setVisibleModalUpdate] = useState<boolean>(false);
  const [question, setQuestion] = useState<IQuestion>({} as IQuestion);

  const onClickUpdateQuestion = (question: IQuestion) => {
    setQuestion(question);
    setVisibleModalUpdate(true);
  };

  const onClickDeleteQuestion = (question: IQuestion) => {
    setQuestion(question);
    setVisibleModalDelete(true);
  };

  const deleteQuestion = async (questionId = -1) => {
    try {
      const { data } = await questionServices.deleteQuestion(questionId);
      if (data.success) {
        notify({
          message: deleteQuestionSuccess,
          type: 'success',
        } as iNotification);

        getTopic(Number(id));
      }
    } catch (error) {
      notify({
        message: 'Something went wrong !',
        type: 'danger',
      } as iNotification);
    }
    setVisibleModalDelete(false);
  };

  return (
    <>
      <ModalConfirm
        visible={visibleModalDelete}
        onConfirm={deleteQuestion}
        onCancle={() => setVisibleModalDelete(false)}
        title={
          <>
            Bạn có chắc chắn muốn xóa bỏ câu hỏi:{' '}
            <PolaCode
              content={question?.content || ''}
              className="ml-2 font-semibold"
            />
            ?
          </>
        }
      />

      <Modal
        visible={visibleModalUpdate}
        setVisibleModal={setVisibleModalUpdate}
      >
        <UpdateQuestion
          questionData={question}
          setVisibleModalEditQuestion={setVisibleModalUpdate}
        />
      </Modal>

      {topic.questions &&
        topic.questions.map((question: IQuestion, index: number) => {
          return (
            <QuestionItem
              onClickDeleteQuestion={onClickDeleteQuestion}
              onClickUpdateQuestion={onClickUpdateQuestion}
              question={question}
              index={index + 1}
              key={question.id}
            />
          );
        })}
    </>
  );
};

export default QuestionList;
