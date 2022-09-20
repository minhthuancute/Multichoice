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
  isMultilCorrectAnswer: boolean;
}

interface ICreateAnswerProps {
  props: ICreateAnswer;
  ref: any;
}

interface IAnswers {
  answers: CreatAnswer[];
}

const CreateAnswer: React.FC<ICreateAnswerProps> = forwardRef((props, ref) => {
  const {
    onAddAnswer,
    onRemoveAnswer,
    invalidAnswers = false,
    isMultilCorrectAnswer = false,
  } = props.props;
  const { setValue, getValues, register, control, watch } = useForm<IAnswers>({
    resolver: yupResolver(answerSchema),
  });

  const { remove, fields, append } = useFieldArray({
    control,
    shouldUnregister: true,
    name: 'answers',
  });

  useEffect(() => {
    const answers = Array.from({ length: 4 }).map((item) => {
      const answer: CreatAnswer = {
        content: '',
        isCorrect: false,
      };
      return answer;
    });
    setValue('answers', answers);
  }, []);

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
        message: 'Số câu trả lời tối đa là 4 !',
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
      const filterAnswer = answers.filter((_: any, index: number) => {
        return indexAnswer !== index;
      });

      onRemoveAnswer(filterAnswer);
      remove(indexAnswer);
    } else {
      notify({
        message: 'Câu hỏi phải có ít nhất hai câu trả lời !',
        type: 'danger',
      } as iNotification);

      return;
    }
  };

  const handleIndexCorrectAnswer = (answers: CreatAnswer[] = []) => {
    if (isMultilCorrectAnswer) {
      return;
    }
    const valueCorrect = answers.find((answer: CreatAnswer) => {
      return answer.isCorrect;
    })?.content;
    setCorrectAnswer(valueCorrect || '');
  };

  useEffect(() => {
    const subscription = watch((value: any) => {
      onAddAnswer(value.answers as CreatAnswer[]);
      handleIndexCorrectAnswer(value.answers);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    console.log(isMultilCorrectAnswer);

    if (isMultilCorrectAnswer) {
      setCorrectAnswer('');
    }
  }, [isMultilCorrectAnswer]);

  useImperativeHandle(
    ref,
    () => ({
      submitForm: () => {
        // submitBtnRef.current.click();
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
                onDeleteAnswer={onDeleteAnswer}
                correctAnswer={correctAnswer}
                answerValue={getValues(nameContent) || ''}
                indexAnswer={index}
                indexAscii={index}
                isMultilCorrectAnswer={isMultilCorrectAnswer}
                isCheckedAnswer={getValues(`answers.${index}.isCorrect`)}
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
});

export default CreateAnswer;
