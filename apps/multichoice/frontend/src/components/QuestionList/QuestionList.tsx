import React, { useState } from 'react';
import { iNotification } from 'react-notifications-component';
import { useParams } from 'react-router-dom';
import { deleteQuestionSuccess } from '../../constants/msgNotify';
import { notify } from '../../helper/notify';
import { questionServices } from '../../services/QuestionServices';
import { topicServices } from '../../services/TopicServices';
import { topicStore } from '../../store/rootReducer';
import { IQuestion } from '../../types';
import ModalConfirm from '../Commons/ModalConfirm/ModalConfirm';
import Modal from '../Commons/Modal/Modal';
import PolaCode from '../Commons/PolaCode/PolaCode';
import QuestionItem from '../QuestionItem/QuestionItem';
import UpdateQuestion from '../UpdateQuestion/UpdateQuestion';

const QuestionList: React.FC = () => {
  const query = useParams();
  const { topicDetail, setTopicDetail } = topicStore();

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [question, setQuestion] = useState<IQuestion>({} as IQuestion);

  const onClickUpdateQuestion = (question: IQuestion) => {
    setQuestion(question);
    setVisibleModal(true);
  };

  const onClickDeleteQuestion = (question: IQuestion) => {
    setQuestion(question);
    setVisibleModal(true);
  };

  const getTopicDetail = async () => {
    const { id } = query;
    try {
      const { data } = await topicServices.getTopicById(Number(id));
      setTopicDetail(data);
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

        getTopicDetail();
      }
    } catch (error) {
      notify({
        message: 'Something went wrong !',
        type: 'danger',
      } as iNotification);
    }
    setVisibleModal(false);
  };

  return (
    <>
      <ModalConfirm
        visible={visibleModal}
        onConfirm={deleteQuestion}
        onCancle={() => setVisibleModal(false)}
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

      <Modal visible={visibleModal} setVisibleModal={setVisibleModal}>
        <UpdateQuestion
          questionData={question}
          setVisibleModalEditQuestion={setVisibleModal}
        />
      </Modal>

      {topicDetail.questions &&
        topicDetail.questions.map((question: IQuestion, index: number) => {
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
