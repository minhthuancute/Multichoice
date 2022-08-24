import React, { useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Checkbox from '../Commons/Checkbox/Checkbox';
import TextArea from '../Commons/TextArea/TextArea';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreatAnswer } from '@monorepo/multichoice/dto';

interface IAnswerItem {
  indexAnswer: number;
  onDeleteAnswer: (index: number) => void;
}

// const schemaAnswer = yup.object().shape({
//   answers: yup.array().of(
//     yup.object().shape({
//       content: yup.string().required(),
//       isCorrect: yup.boolean(),
//     })
//   ),
// });

const schemaAnswer = yup.object().shape({
  answers: yup.object().shape({
    content: yup.string().required(),
    isCorrect: yup.boolean(),
  }),
});

const AnswerItem: React.FC<IAnswerItem> = ({ indexAnswer, onDeleteAnswer }) => {
  const { register, handleSubmit, setValue } = useForm<CreatAnswer>({
    resolver: yupResolver(schemaAnswer),
  });

  const getAsciiCode = (): string => {
    const startCharacter = 65;
    return String.fromCharCode(startCharacter + indexAnswer) + ')';
  };

  return (
    <div className="my-5 last:mb-0 group cursor-pointer">
      <div className="form-group flex">
        <div className="check-correct flex items-start mr-2">
          <Checkbox
            registerField={register('isCorrect')}
            className="mt-1"
            id={'answer-' + indexAnswer}
          />
          <span className="font-semibold">{getAsciiCode()}</span>
        </div>
        <TextArea
          registerField={register('content')}
          placeholder="Nhập câu trả lời"
          className="flex-1"
        />
      </div>
      <div
        className="remove opacity-0 invisible transition-all duration-200
        group-hover:opacity-100 group-hover:visible
      "
      >
        <button
          type="button"
          className="text-sm font-semibold bg-red-50 text-red-500 flex items-center
          ml-auto px-2.5 py-0.5 rounded-sm"
          onClick={() => onDeleteAnswer(indexAnswer)}
        >
          <RiDeleteBin6Line className="mr-1" />
          Xóa
        </button>
      </div>
    </div>
  );
};

export default AnswerItem;
