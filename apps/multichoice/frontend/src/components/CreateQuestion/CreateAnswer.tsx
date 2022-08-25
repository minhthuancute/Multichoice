import { yupResolver } from '@hookform/resolvers/yup';
import { CreatAnswer } from '@monorepo/multichoice/dto';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { generateArray } from '../../utils/generateArray';
import Notify from '../Commons/Notify/Notify';
import AnswerItem from './AnswerItem';
import { HiInformationCircle } from 'react-icons/hi';

const answerSchema = yup.object().shape({
  answers: yup.array().of(
    yup.object().shape({
      content: yup.string().required(),
      isCorrect: yup.boolean(),
    })
  ),
});

interface ICreateAnswer {
  onAddAnswer: (answers: CreatAnswer[]) => void;
  invalidAnswers?: boolean;
}

const CreateAnswer: React.FC<ICreateAnswer> = ({
  onAddAnswer,
  invalidAnswers = false,
}) => {
  const { register, watch } = useForm<[CreatAnswer]>({
    resolver: yupResolver(answerSchema),
  });

  const [showNotify, setShowNotify] = useState<boolean>(false);
  const [answerLength, setAnswerLength] = useState<number[]>(generateArray(4));

  const addNewAnswer = () => {
    if (answerLength.length > 64) {
      return;
    }

    setAnswerLength([
      ...answerLength,
      answerLength[answerLength.length - 1] + 1,
    ]);
  };

  const onDeleteAnswer = (index: number) => {
    if (answerLength.length === 2) {
      setShowNotify((state) => !state);
      return;
    }
    const filterAnswer = answerLength.filter((item: number) => {
      return item !== index;
    });
    setAnswerLength(filterAnswer);
  };

  useEffect(() => {
    const subscription = watch((value: any) => {
      onAddAnswer(value.answers as CreatAnswer[]);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  return (
    <div>
      <div className="noti">
        <Notify
          content="All notifications have been set to be automatically dismissed after 5000ms."
          showNotify={showNotify}
        />
      </div>
      <div className="answer mt-4">
        <div className="answer-header">
          <label className="font-semibold text-slate-800 text-sm inline-block mb-2">
            Đáp án
            <span className="ml-1 text-red-600">*</span>
          </label>
        </div>
        <div className="answer-body">
          {answerLength.map((item: number, index: number) => {
            const nameContent = `answers[${index}].content` as any;
            const nameIsCorrect = `answers[${index}].isCorrect` as any;
            const registerContent = register(nameContent);
            const registerIsCorrect = register(nameIsCorrect);

            return (
              <AnswerItem
                key={item}
                registerFieldContent={registerContent}
                registerFieldIsCorrect={registerIsCorrect}
                onDeleteAnswer={onDeleteAnswer}
                indexAnswer={item}
                indexAscii={index}
              />
            );
          })}
        </div>
        {invalidAnswers ? (
          <div className="show-error mt-3">
            <p className="text-red-500 text-xs">Answers cannot be left blank</p>
          </div>
        ) : null}
        <div className="add-answer mt-5">
          <button
            type="button"
            className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-white font-bold bg-violet-800"
            onClick={() => addNewAnswer()}
          >
            Thêm đáp án
          </button>
          <div className="bg-green-50 rounded-md p-4 mt-3 flex items-center">
            <HiInformationCircle className="fill-green-800 mr-2 text-xl" />
            <p className="text-sm text-green-800">
              Tick vào ô vuông cạnh đáp án để chọn
              <span className="text-green-600 font-semibold">
                {' '}
                đáp án đúng.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAnswer;
