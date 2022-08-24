import { yupResolver } from '@hookform/resolvers/yup';
import { CreatAnswer } from '@monorepo/multichoice/dto';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { generateArray } from '../../utils/generateArray';
import AnswerItem from './AnswerItem';

const answerSchema = yup.object().shape({
  answers: yup.array().of(
    yup.object().shape({
      content: yup.string().required(),
      isCorrect: yup.boolean(),
    })
  ),
});

const CreateAnswer: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<CreatAnswer>({
    resolver: yupResolver(answerSchema),
  });

  const [answerLength, setAnswerLength] = useState<number[]>(generateArray(4));

  const addNewAnswer = () => {
    setAnswerLength([
      ...answerLength,
      answerLength[answerLength.length - 1] + 1,
    ]);
  };

  const onDeleteAnswer = (index: number) => {
    const filterAnswer = answerLength.filter((item: number) => {
      return item !== index;
    });
    setAnswerLength(filterAnswer);
  };

  return (
    <div className="answer mt-4">
      <div className="answer-header">
        <label className="font-semibold text-slate-800 text-sm inline-block mb-2">
          Đáp án
          <span className="ml-1 text-red-600">*</span>
        </label>
      </div>
      <div className="answer-body">
        {answerLength.map((item: number, index: number) => {
          return (
            <AnswerItem
              key={item}
              onDeleteAnswer={onDeleteAnswer}
              indexAnswer={index}
            />
          );
        })}
      </div>
      <div className="add-answer mt-5 flex items-center justify-between">
        <button
          type="button"
          className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-slate-900 font-bold bg-violet-200"
          onClick={() => addNewAnswer()}
        >
          Thêm đáp án
        </button>
        <p className="text-sm text-slate-800">
          (*) Tick vào ô vuông cạnh đáp án để chọn
          <span className="text-green-600 font-semibold"> đáp án đúng.</span>
        </p>
      </div>
    </div>
  );
};

export default CreateAnswer;
