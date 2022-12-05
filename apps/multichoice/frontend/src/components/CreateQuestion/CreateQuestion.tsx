import React, { useEffect, useState } from 'react';
import Input from '../Commons/Input/Input';
import { CreatAnswer, CreateQuestionDto } from '@monorepo/multichoice/dto';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { IOption } from '../Commons/Select/Select';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { useNavigate } from 'react-router-dom';
import { questionServices } from '../../services/QuestionServices';
import { topicStore } from '../../store/rootReducer';
import { useQuery } from '../../hooks/useQuery';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import Editor from '../Commons/Editor/Editor';
import { classNames } from '../../helper/classNames';
import { errNotSelectCorrectAnswer } from '../../constants/msgNotify';
import Button from '../Commons/Button/Button';
import AnswerItem from '../AnswerItem/AnswerItem';
import { schemaCreateQuestion } from './createQuestionSchema';

interface CreateQuestionQuery {
  topic_id: string;
}

const CreateQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [query] = useQuery<CreateQuestionQuery>();
  const { topic } = topicStore();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    setError,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateQuestionDto>({
    resolver: yupResolver(schemaCreateQuestion),
    mode: 'all',
    defaultValues: {
      answers: [
        {
          content: '',
          isCorrect: false,
        },
        {
          content: '',
          isCorrect: false,
        },
        {
          content: '',
          isCorrect: false,
        },
        {
          content: '',
          isCorrect: false,
        },
      ],
      content: '',
      isActive: true,
      time: 0,
      topicID: +query.topic_id,
      type: QuestionTypeEnum.SINGLE,
    },
  });
  const { remove, fields, append } = useFieldArray({
    control,
    name: 'answers',
  });

  const [hideAnswer, setHideAnswer] = useState<boolean>(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
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
    const isQuestionTypeText = questionType === QuestionTypeEnum.TEXT;
    if (isQuestionTypeText) {
      return true;
    }
    const haveCorrectAnswer = answers.some(
      (answers: CreatAnswer) => answers.isCorrect
    );
    const haveEmptyContent = answers.some(
      (answers: CreatAnswer) => answers.content === ''
    );

    if (haveEmptyContent) {
      setError('answers', {
        message: 'Answers content is required',
      });
      return false;
    }

    if (!haveCorrectAnswer) {
      notify({
        message: errNotSelectCorrectAnswer,
        type: 'danger',
      } as iNotification);
      return false;
    }
    return true;
  };

  const onSubmit: SubmitHandler<CreateQuestionDto> = async (formData) => {
    if (validAnswers()) {
      try {
        if (formData.type === QuestionTypeEnum.TEXT) {
          formData.answers.length = 0;
        }

        const { data } = await questionServices.createQuestion(formData);
        if (data.success) {
          const urlNavigate = '/tests/edit/' + query.topic_id;
          navigate(urlNavigate);
        }
      } catch (error) {
        //
      }
    }
  };

  useEffect(() => {
    const subscription = watch(({ type, answers }) => {
      if (type === QuestionTypeEnum.SINGLE) {
        const correctAnswer = answers?.find((answer) => answer?.isCorrect);
        setCorrectAnswer(correctAnswer?.content || '');
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <form
      className="container form flex items-start"
      id="form-create-question"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="form-left w-1/3 p-4 bg-white rounded-md">
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
          defaultValue={questionTypes[0].label}
          options={questionTypes}
          textLabel="Loại câu hỏi"
        />
      </div>
      <div className="form-right w-2/3 ml-4 p-4 bg-white rounded-md">
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
              {fields.map((item: CreatAnswer, index: number) => {
                return (
                  <AnswerItem
                    key={index}
                    indexAnswer={index}
                    lengthAnswers={watch('answers').length}
                    correctAnswer={correctAnswer}
                    registerFieldContent={register(`answers.${index}.content`)}
                    registerFieldIsCorrect={register(
                      `answers.${index}.isCorrect`
                    )}
                    answerValue={watch(`answers.${index}.content`)}
                    questionType={watch('type')}
                    removeAnswer={remove}
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
      </div>
    </form>
  );
};

export default CreateQuestion;
