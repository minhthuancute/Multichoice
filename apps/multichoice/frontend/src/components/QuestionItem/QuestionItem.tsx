import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { classNames } from '../../helper/classNames';
import { IAnswer, IQuestion } from '../../types';
import ToolTip from '../Commons/ToolTip/ToolTip';
import FormEditQuestion from '../EditQuestion/FormEditQuestion';
import Modal from '../Modal/Modal';
import PolaCode from '../PolaCode/PolaCode';

export interface IQuestionItem {
  index: number;
  question: IQuestion;
  handleDeleteQuestion: (question: IQuestion) => void;
  onUpdateQuestionSuccess: () => void;
}

const QuestionItem: React.FC<IQuestionItem> = ({
  question,
  index,
  handleDeleteQuestion,
  onUpdateQuestionSuccess,
}) => {
  const [openModalEditQuestion, setOpenModalEditQuestion] =
    useState<boolean>(false);

  const cbOnUpdateQuestion = () => {
    onUpdateQuestionSuccess();
  };

  return (
    <>
      <Modal openModal={openModalEditQuestion}>
        <FormEditQuestion
          questionData={question}
          setOpenModalEditQuestion={setOpenModalEditQuestion}
          cbOnUpdateQuestion={cbOnUpdateQuestion}
        />
      </Modal>
      <div className="container mb-4 last:mb-0">
        <div className="question-content py-4 px-6 bg-white rounded-lg">
          <div className="header pb-4 text-slate-800 text-tiny flex justify-between">
            <div className="header-left flex text-tiny">
              <span className="w-21 font-semibold mr-2">Câu hỏi {index}:</span>
              <PolaCode content={question.content} />
            </div>
            <div className="header-right">
              <ul className="ctas flex items-center ml-auto">
                <li className="relative group mr-5 mb-0.5">
                  <ToolTip title="Cập nhật câu hỏi">
                    <button onClick={() => setOpenModalEditQuestion(true)}>
                      <FaPencilAlt className="text-slate-800 text-xs" />
                    </button>
                  </ToolTip>
                </li>
                <li className="relative group">
                  <ToolTip title="Xóa">
                    <button onClick={() => handleDeleteQuestion(question)}>
                      <RiDeleteBin6Line className="text-red-500 text-base" />
                    </button>
                  </ToolTip>
                </li>
              </ul>
            </div>
          </div>
          <div className="body pt-4 border-t border-slate-200">
            <ul>
              {question &&
                question.answers.map((answer: IAnswer, index: number) => (
                  <li
                    key={answer.id}
                    className="flex items-start text-slate-800 text-tiny mb-2 last:mb-0"
                  >
                    <span
                      className={classNames(
                        'font-semibold flex items-center min-w-max',
                        {
                          'text-green-600 underline': answer.isCorrect,
                        }
                      )}
                    >
                      Đáp án {String.fromCharCode(65 + index)} :
                    </span>
                    <span className="ml-2">{answer.content}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionItem;
