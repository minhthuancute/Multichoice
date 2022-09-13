import { yupResolver } from '@hookform/resolvers/yup';
import { CreatAnswer } from '@monorepo/multichoice/dto';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { generateArray } from '../../utils/generateArray';
import AnswerItem from './AnswerItem';
import { HiInformationCircle } from 'react-icons/hi';
import { iNotification } from 'react-notifications-component';
import { notify } from '../../helper/notify';

const answerSchema = yup.object().shape({
  answers: yup.array().of(
    yup.object().shape({
      content: yup.string().required(),
      isCorrect: yup.boolean(),
    })
  ),
});

interface ICreateAnswer {
  onRemoveAnswer: (filterAnswer: CreatAnswer[]) => void;
  onAddAnswer: (answers: CreatAnswer[]) => void;
  invalidAnswers?: boolean;
}

const CreateAnswer: React.FC<ICreateAnswer> = ({
  onAddAnswer,
  onRemoveAnswer,
  invalidAnswers = false,
}) => {
  const { getValues, register, unregister, watch, control, resetField } =
    useForm<[CreatAnswer]>({
      resolver: yupResolver(answerSchema),
    });

  const { remove } = useFieldArray({
    control,
    shouldUnregister: true,
    name: 'answers' as never,
  });

  const [answerLength, setAnswerLength] = useState<number[]>(generateArray(4));
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  const addNewAnswer = () => {
    if (answerLength.length + 1 > 4) {
      notify({
        message: 'Số câu trả lời tối đa là 4 !',
        type: 'danger',
      } as iNotification);
      return;
    }

    setAnswerLength([
      ...answerLength,
      answerLength[answerLength.length - 1] + 1,
    ]);
  };

  const onDeleteAnswer = (index: number) => {
    if (answerLength.length - 1 === 1) {
      notify({
        message: 'Câu hỏi phải có ít nhất hai câu trả lời !',
        type: 'danger',
      } as iNotification);

      return;
    }

    const nameContent = `answers[${index}].content` as any;
    const valueItem = getValues(nameContent) as any;
    if (valueItem === correctAnswer) {
      setCorrectAnswer('');
    }

    const filterAnswerLength = answerLength.filter((item: number) => {
      return item !== index;
    });

    if (getValues('0')) {
      const nameContent = `answers[${index}]` as any;
      unregister(nameContent);
      resetField('answers' as any);
    }

    const answers: any = getValues('answers' as any);
    const filterAnswer = answers.filter((_: any, indexAnswer: number) => {
      return indexAnswer !== index;
    });

    setAnswerLength(filterAnswerLength);
    onRemoveAnswer(filterAnswer);
    remove(index);
  };

  const indexCorrectAnswer = (answers: CreatAnswer[] = []) => {
    const valueCorrect = answers.find((answer: CreatAnswer) => {
      return answer.isCorrect;
    })?.content;
    setCorrectAnswer(valueCorrect || '');
  };

  useEffect(() => {
    const subscription = watch((value: any) => {
      onAddAnswer(value.answers as CreatAnswer[]);
      indexCorrectAnswer(value.answers);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  return (
    <div>
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
                correctAnswer={correctAnswer}
                answerValue={(getValues(nameContent) as any) || ''}
                indexAnswer={index}
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
