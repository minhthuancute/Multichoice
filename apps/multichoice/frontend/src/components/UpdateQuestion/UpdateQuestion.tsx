import React, { useEffect, useState } from 'react';
import Input from '../Commons/Input/Input';
import { CreatAnswer, CreateQuestionDto } from '@monorepo/multichoice/dto';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { IOption } from '../Commons/Select/Select';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { questionServices } from '../../services/Question/QuestionServices';
import { IAnswer, topicStore } from '../../store/rootReducer';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import Editor from '../Commons/Editor/Editor';
import { classNames } from '../../helper/classNames';
import { errNotSelectCorrectAnswer } from '../../constants/msgNotify';
import Button from '../Commons/Button/Button';
import AnswerItem from '../AnswerItem/AnswerItem';
import { schemaUpdateQuestion } from './updateQuestionSchema';
import { useParams } from 'react-router-dom';
import { IQuestion } from '../../types/Topic';

const initialQuestions = [
  {
    content: '',
    isCorrect: false,
  },
  {
    content: '',
    isCorrect: false,
  },
];

interface IUpdateQuestionprops {
  questionData: IQuestion;
  setVisibleModalEditQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateQuestion: React.FC<IUpdateQuestionprops> = ({
  questionData,
  setVisibleModalEditQuestion,
}) => {
  const { id } = useParams();

  const { topic, getTopic } = topicStore();
  const isQuestionText = questionData.type === QuestionTypeEnum.TEXT;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateQuestionDto>({
    resolver: yupResolver(schemaUpdateQuestion),
    mode: 'all',
    defaultValues: questionData,
  });
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'answers',
  });

  const [indexCorrectAnswer, setIndexCorrectAnswer] = useState<number>(-1);
  const [hideAnswer, setHideAnswer] = useState<boolean>(isQuestionText);

  const [questionTypes] = useState<IOption[]>(() => {
    const types: QuestionTypeEnum[] = [];
    for (const topic in QuestionTypeEnum) {
      const topicVal = topic.toLocaleLowerCase() as QuestionTypeEnum;
      types.push(topicVal);
    }
    const options: IOption[] = types.map((topic: QuestionTypeEnum) => {
      return {
        label: topic,
        value: topic,
      };
    });
    return options;
  });

  const onSelectQuestionType = (item: IOption) => {
    setValue('type', item.value as QuestionTypeEnum);
    if (hideAnswer || isQuestionText) {
      setValue('answers', initialQuestions);
    }

    switch (item.value) {
      case QuestionTypeEnum.MULTIPLE: {
        setHideAnswer(false);
        break;
      }

      case QuestionTypeEnum.SINGLE: {
        setHideAnswer(false);
        const answers = getValues('answers');
        const resetAnswers: CreatAnswer[] = answers.map(
          (answer: CreatAnswer) => {
            return {
              ...answer,
              isCorrect: false,
            };
          }
        );
        setValue('answers', resetAnswers);
        break;
      }

      case QuestionTypeEnum.TEXT: {
        setHideAnswer(true);
        clearErrors('answers');
        break;
      }

      default:
        break;
    }
  };

  const validAnswers = (): boolean => {
    const answers = getValues('answers');
    const questionType = getValues('type');
    if (questionType === QuestionTypeEnum.TEXT) {
      return true;
    }
    const haveCorrectAnswer = answers.some(
      (answers: CreatAnswer) => !!answers.isCorrect
    );

    if (!haveCorrectAnswer) {
      notify({
        message: errNotSelectCorrectAnswer,
        type: 'danger',
      } as iNotification);
      return false;
    }
    return true;
  };

  const setCorectAnswerSingle = (indexAnswer: number) => {
    setIndexCorrectAnswer(indexAnswer);
  };

  const formatAnswers = () => {
    const format = getValues('answers').map((answer, index) => {
      return {
        ...answer,
        isCorrect: index === indexCorrectAnswer,
      };
    });
    return format;
  };

  const onSubmit: SubmitHandler<CreateQuestionDto> = async (formData) => {
    const { type } = formData;
    if (type === QuestionTypeEnum.SINGLE && indexCorrectAnswer !== -1) {
      formData.answers = formatAnswers();
    }
    if (validAnswers()) {
      try {
        if (formData.type === QuestionTypeEnum.TEXT) {
          formData.answers.length = 0;
        }

        const { data } = await questionServices.updateQuestion(
          questionData.id,
          formData
        );

        if (data.success) {
          getTopic(Number(id));
          setVisibleModalEditQuestion(false);
        }
      } catch (error) {
        //
      }
    }
  };

  useEffect(() => {
    const formatAnswers = getValues('answers').map((answer) => {
      return {
        ...answer,
        isCorrect: !!answer.isCorrect,
      };
    });
    setValue('answers', formatAnswers);
  }, []);

  return (
    <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded-md mb-4">
        {topic.typeCategoryName === 'game' ? (
          <Input
            registerField={register('time')}
            typeInput="number"
            textLabel="Thời gian làm bài"
            id="expirationTime"
            isError={Boolean(errors.time)}
            errMessage={errors.time?.message}
            isDisable={topic.typeCategoryName !== 'game'}
          />
        ) : null}
        <Select
          onChange={onSelectQuestionType}
          defaultValue={questionData.type}
          options={questionTypes}
          textLabel="Loại câu hỏi"
        />
      </div>
      <div className="relative">
        <label className="font-semibold text-slate-800 text-sm inline-block mb-2">
          Nội dung
          <span className="ml-1 text-red-600">*</span>
        </label>
        <Editor
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={control as any}
          name="content"
          placeholder="Nội dung câu hỏi"
          isError={Boolean(errors.content)}
          errMessage={errors.content?.message}
        />
      </div>
      <div
        className={classNames('create-answer', {
          hidden: hideAnswer,
        })}
      >
        <div className="answer mt-4">
          <div className="answer-header">
            <label className="font-semibold text-slate-800 text-sm inline-block mb-2">
              Đáp án
              <span className="ml-1 text-red-600">*</span>
            </label>
          </div>
          <div className="answer-body">
            {fields.map((item, index: number) => {
              return (
                <AnswerItem
                  key={item.isCorrect + '-' + index}
                  indexAnswer={index}
                  lengthAnswers={watch('answers').length}
                  registerFieldContent={register(`answers.${index}.content`)}
                  registerFieldIsCorrect={register(
                    `answers.${index}.isCorrect`
                  )}
                  questionType={watch('type')}
                  removeAnswer={remove}
                  setCorectAnswerSingle={setCorectAnswerSingle}
                  clearErrors={clearErrors}
                  isCorrect={item.isCorrect}
                />
              );
            })}
          </div>
          {errors.answers ? (
            <div className="show-error mt-3">
              <p className="text-red-500 text-xs">{errors.answers.message}</p>
            </div>
          ) : null}
          <div className="add-answer mt-5 text-end">
            <Button
              type="button"
              onClick={() => {
                if (getValues('answers').length + 1 !== 5) {
                  append({
                    content: '',
                    isCorrect: false,
                  });
                }
              }}
            >
              Thêm đáp án
            </Button>
          </div>
        </div>
      </div>
      <div className="ctas flex items-center justify-end gap-x-2 mt-8">
        <Button
          type="button"
          onClick={() => setVisibleModalEditQuestion(false)}
        >
          Huỷ
        </Button>
        <Button
          type="submit"
          color="success"
          // onClick={() => setVisibleModalEditQuestion(false)}
        >
          Cập nhật
        </Button>
      </div>
    </form>
  );
};

export default UpdateQuestion;
