import { yupResolver } from '@hookform/resolvers/yup';
import { CreatAnswer } from '@monorepo/multichoice/dto';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import AnswerItem from '../AnswerItem/AnswerItem';
import { iNotification } from 'react-notifications-component';
import { notify } from '../../helper/notify';
import {
  errMaxlengthAnswer,
  errMinlengthAnswer,
} from '../../constants/msgNotify';

export const answerSchema = yup.object().shape({
  answers: yup.array().of(
    yup.object().shape({
      content: yup.string().required(),
      isCorrect: yup.boolean(),
    })
  ),
});

interface IUpdateAnswers {
  answers: CreatAnswer[];
}

interface IUpdateAnswerProps {
  answers: CreatAnswer[];
  onRemoveAnswer: (filterAnswer: CreatAnswer[]) => void;
  onAddAnswer: (answers: CreatAnswer[]) => void;
  invalidAnswers?: boolean;
  isMultilCorrectAnswer: boolean;
  ref: any;
}

const UpdateAnswer: React.FC<IUpdateAnswerProps> = forwardRef(
  (props: IUpdateAnswerProps, ref) => {
    const {
      answers,
      onAddAnswer,
      onRemoveAnswer,
      invalidAnswers = false,
      isMultilCorrectAnswer,
    } = props;

    const { setValue, getValues, register, control, watch, reset } =
      useForm<IUpdateAnswers>({
        resolver: yupResolver(answerSchema),
      });

    const { remove, fields, append } = useFieldArray({
      control,
      shouldUnregister: true,
      name: 'answers',
    });

    const [correctAnswer, setCorrectAnswer] = useState<string>('');

    const addNewAnswer = () => {
      const canAddNewAnswer = getValues('answers').length + 1 <= 4;
      if (canAddNewAnswer) {
        const newAnswer: CreatAnswer = {
          content: '',
          isCorrect: false,
        };
        append(newAnswer);
      } else {
        notify({
          message: errMaxlengthAnswer,
          type: 'danger',
        } as iNotification);
        return;
      }
    };

    const onDeleteAnswer = (indexAnswer: number) => {
      const canDeleteAnswer = getValues('answers').length - 1 !== 1;
      if (canDeleteAnswer) {
        const nameContent =
          `answers.${indexAnswer}.content` as `answers.${number}.content`;
        const valueItem = getValues(nameContent);
        if (valueItem === correctAnswer) {
          setCorrectAnswer('');
        }

        const answers: CreatAnswer[] = getValues('answers');
        const filterAnswer = answers.filter(
          (_: CreatAnswer, indexAnswerFilter: number) => {
            return indexAnswer !== indexAnswerFilter;
          }
        );

        onRemoveAnswer(filterAnswer);
        remove(indexAnswer);
      } else {
        notify({
          message: errMinlengthAnswer,
          type: 'danger',
        } as iNotification);

        return;
      }
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

    useEffect(() => {
      setValue('answers', answers);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        resetAnswers: () => {
          const answers = getValues('answers');
          const resetAnswers: CreatAnswer[] = answers.map(
            (answer: CreatAnswer) => {
              return {
                ...answer,
                isCorrect: false,
              };
            }
          );
          reset({
            answers: resetAnswers,
          });
        },
      }),
      []
    );

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
            {fields.map((item: CreatAnswer, index: number) => {
              const nameContent =
                `answers.${index}.content` as `answers.${number}.content`;
              const nameIsCorrect =
                `answers.${index}.isCorrect` as `answers.${number}.isCorrect`;

              const registerContent = register(nameContent);
              const registerIsCorrect = register(nameIsCorrect);

              return (
                <AnswerItem
                  key={index}
                  registerFieldContent={registerContent}
                  registerFieldIsCorrect={registerIsCorrect}
                  correctAnswer={correctAnswer}
                  answerValue={getValues(nameContent) || ''}
                  indexAnswer={index}
                  lengthAnswers={0}
                />
              );
            })}
          </div>
          {invalidAnswers ? (
            <div className="show-error mt-3">
              <p className="text-red-500 text-xs">
                Answers content is required
              </p>
            </div>
          ) : null}
          <div className="add-answer mt-5">
            <button
              type="button"
              className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-white font-bold bg-slate-800 ml-auto"
              onClick={() => addNewAnswer()}
            >
              Thêm đáp án
            </button>
            <div className="bg-green-50 rounded-md px-4 py-2 mt-3 flex items-center">
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
  }
);

export default UpdateAnswer;
