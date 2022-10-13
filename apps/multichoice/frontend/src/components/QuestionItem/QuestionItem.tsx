import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
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
}

const QuestionItem: React.FC<IQuestionItem> = ({
  question,
  index,
  handleDeleteQuestion,
}) => {
  const [openModalEditQuestion, setOpenModalEditQuestion] =
    useState<boolean>(false);

  const isTypeTextQuestion = question.type === QuestionTypeEnum.TEXT;

  return (
    <>
      <Modal
        openModal={openModalEditQuestion}
        setOpenModal={setOpenModalEditQuestion}
      >
        <FormEditQuestion
          questionData={question}
          setOpenModalEditQuestion={setOpenModalEditQuestion}
        />
      </Modal>
      <div className="container mb-4 last:mb-0">
        <div className="question-content py-4 px-6 bg-white rounded-lg">
          <div
            className={classNames(
              'header text-slate-800 text-tiny flex justify-between',
              {
                'pb-2': !isTypeTextQuestion,
              }
            )}
          >
            <div className="header-left flex text-tiny">
              <span className="font-semibold mr-2 min-w-max">
                Câu hỏi {index}:
              </span>
              <PolaCode content={question.content} />
            </div>
            <div className="header-right ml-2">
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
          <div
            className={classNames('body ', {
              'pt-2 border-t border-slate-200': !isTypeTextQuestion,
            })}
          >
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

            {question.type === QuestionTypeEnum.MULTIPLE ? (
              <div className="mt-2">
                <p className="text-sm text-primary-800 italic">
                  (Có thể có nhiều đáp án đúng)
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionItem;
