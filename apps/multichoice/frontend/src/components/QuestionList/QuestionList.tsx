import React, { useState } from 'react';
import { iNotification } from 'react-notifications-component';
import { useParams } from 'react-router-dom';
import { deleteQuestionSuccess } from '../../constants/msgNotify';
import { notify } from '../../helper/notify';
import { questionServices } from '../../services/Question/QuestionServices';
import { topicStore } from '../../store/rootReducer';
import ModalConfirm from '../Commons/ModalConfirm/ModalConfirm';
import Modal from '../Commons/Modal/Modal';
import PolaCode from '../Commons/PolaCode/PolaCode';
import QuestionItem from '../QuestionItem/QuestionItem';
import UpdateQuestion from '../UpdateQuestion/UpdateQuestion';
import { IQuestion } from '../../types/Topic';

const QuestionList: React.FC = () => {
  const { id } = useParams();

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

  const deleteQuestion = async () => {
    try {
      const { data } = await questionServices.deleteQuestion(question.id);
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
        size="sm"
        visible={visibleModalDelete}
        onConfirm={deleteQuestion}
        onCancle={() => setVisibleModalDelete(false)}
        label="Xóa bỏ câu hỏi"
        title={
          <div className="flex">
            Bạn có chắc chắn muốn xóa bỏ câu hỏi:{' '}
            <PolaCode content={question?.content || ''} className="ml-2 " />?
          </div>
        }
      />

      <Modal
        headerTitle="Cập nhật câu hỏi"
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
