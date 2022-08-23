import { yupResolver } from '@hookform/resolvers/yup';
import { AnswersUserDto, CreatAnswer } from '@monorepo/multichoice/dto';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// const answerSchema = yup.array().of(
//   yup.object().shape({
//     content: yup.string().required(),
//     isCorrect: yup.boolean(),
//   })
// );

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

  // const [
  //   answers, setAnswers
  // ] = useState<CreatAnswer[]>([])
  const [answerLength, setAnswerLength] = useState<number>(4);

  return (
    <div className="answer mt-4">
      <div className="answer-header">
        <label className="font-semibold text-slate-800 text-sm inline-block mb-2">
          Đáp án
          <span className="ml-1 text-red-600">*</span>
        </label>
      </div>
      <div className="answer-body"></div>
    </div>
  );
};

export default CreateAnswer;
