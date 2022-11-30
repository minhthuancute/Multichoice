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

const QuestionList: React.FC = () => {
  const query = useParams();
  const { topicDetail, setTopicDetailData } = topicStore();

  const [visibleModalDelete, setVisibleModalDelete] = useState<boolean>(false);
  const [questionDel, setQuestionDel] = useState<IQuestion>();

  const handleDeleteQuestion = (question: IQuestion) => {
    setQuestionDel(question);
    setVisibleModalDelete(true);
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

        setVisibleModalDelete(false);
        getTopicDetail();
      }
    } catch (error) {
      notify({
        message: 'Something went wrong !',
        type: 'danger',
      } as iNotification);
      setVisibleModalDelete(false);
    }
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
              content={questionDel?.content || ''}
              className="ml-2 font-semibold"
            />
            ?
          </>
        }
      />

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
    </>
  );
};

export default QuestionList;
