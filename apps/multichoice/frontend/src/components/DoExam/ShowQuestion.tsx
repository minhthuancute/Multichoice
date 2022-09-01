import React from 'react';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { answerStore, examStore } from '../../store/rootReducer';
import { IAnswer } from '../../types';

interface IShowQuestion {
  indexQuestion: number;
  setIndexQuestion: React.Dispatch<React.SetStateAction<number>>;
}

const ShowQuestion: React.FC<IShowQuestion> = ({
  indexQuestion = 0,
  setIndexQuestion,
}) => {
  const {
    exam: { questions },
  } = examStore();

  const { updateAnswer } = answerStore();

  const questionLength = questions.length;
  const nextQuestion = (e: React.MouseEvent<HTMLElement>) => {
    if (indexQuestion + 1 >= questionLength) {
      e.preventDefault();
      return;
    }
    setIndexQuestion(indexQuestion + 1);
  };

  const preQuestion = (e: React.MouseEvent<HTMLElement>) => {
    if (indexQuestion - 1 < 0) {
      e.preventDefault();
      return;
    }
    setIndexQuestion(indexQuestion - 1);
  };

  const onChooseAnswer = (answersID: number) => {
    const questionID = questions[indexQuestion].id;
    console.log(questionID);

    updateAnswer(questionID, [answersID]);
  };

  if (!questions.length) {
    return null;
  }

  return (
    <div className=" w-full h-max">
      <button
        className="px-6 py-2 bg-red-600 rounded-md text-sm
          text-white flex items-center ml-auto mb-4 font-semibold"
      >
        Nộp bài
      </button>
      <div className="p-10 bg-slate-50 shadow-xl">
        <h4 className="text-slate-800 text-xl font-semibold">
          Câu hỏi {indexQuestion + 1}:{' '}
          <span>{questions[indexQuestion].content}</span>{' '}
        </h4>

        <div className="mt-5">
          {questions &&
            questions[indexQuestion].answers.map(
              (answers: IAnswer, index: number) => {
                return (
                  <label
                    className="text-tiny text-slate-800 mb-3 last:mb-0
                    flex items-center cursor-pointer w-max group"
                    htmlFor={'correct-answer-' + index}
                    key={answers.id}
                    onClick={() => onChooseAnswer(answers.id)}
                  >
                    <div className="checkbox mr-4">
                      <input
                        hidden
                        type="radio"
                        name={'correct-answer'}
                        id={'correct-answer-' + index}
                        className="peer"
                      />
                      <div
                        className="radio mt-0.5 w-4 h-4 border border-solid rounded-full
                    border-primary-900 before:bg-primary-900 before:w-2.5 before:h-2.5 before:block
                    before:rounded-full flex items-center justify-center before:opacity-0
                    peer-checked:before:opacity-100
                    "
                      ></div>
                    </div>
                    <span className="font-semibold mr-2">
                      {String.fromCharCode(65 + index)}:
                    </span>
                    <span>{answers.content}</span>
                  </label>
                );
              }
            )}
        </div>
      </div>
      <div className="ctas mt-10 flex items-center justify-between">
        <button
          className="px-4 py-1 bg-primary-900 rounded-sm text-sm
          text-white flex items-center"
          onClick={(e: React.MouseEvent<HTMLElement>) => preQuestion(e)}
        >
          <BiSkipPrevious className="mr-1 text-xl" />
          Câu hỏi trước
        </button>
        <button
          className="px-4 py-1 bg-primary-900 rounded-sm text-sm
          text-white flex items-center"
          onClick={(e: React.MouseEvent<HTMLElement>) => nextQuestion(e)}
        >
          Câu hỏi sau
          <BiSkipNext className="ml-1 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ShowQuestion;
