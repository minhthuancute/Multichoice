import React, { useRef, useState } from 'react';
import * as yup from 'yup';
import Input from '../Commons/Input/Input';
import { CreatAnswer, CreateQuestionDto } from '@monorepo/multichoice/dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { IOption } from '../Commons/Select/Select';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { useNavigate } from 'react-router-dom';
import { questionServices } from '../../services/QuestionServices';
import CreateAnswer, { IResetAnswersRef } from '../CreateAnswer/CreateAnswer';
import { topicStore } from '../../store/rootReducer';
import { useQuery } from '../../hooks/useQuery';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import Editor from '../Editor/Editor';
import { hasContentEditor } from '../../utils/empty_content_editor';
import { classNames } from '../../helper/classNames';
import { errNotSelectCorrectAnswer } from '../../constants/msgNotify';

const schemaCreateQuestion = yup.object().shape({
  topicID: yup.number(),
  content: yup.string().required('Question content is a required field'),
  time: yup.number(),
  isActive: yup.boolean(),
  answers: yup.array().of(
    yup.object().shape({
      content: yup.string(),
      isCorrect: yup.boolean(),
    })
  ),
});

interface CreateQuestionQuery {
  topic_id: string;
}

const CreateQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [query] = useQuery<CreateQuestionQuery>();
  const { topic } = topicStore();

  const createAnswerRef = useRef<IResetAnswersRef>();

  const [shouldRemoveAnswers, setShouldRemoveAnswers] =
    useState<boolean>(false);

  const {
    resetField,
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<CreateQuestionDto>({
    resolver: yupResolver(schemaCreateQuestion),
    defaultValues: {
      answers: [],
      content: '',
      isActive: true,
      time: 0,
      topicID: +query.topic_id,
      type: QuestionTypeEnum.SINGLE,
    },
  });

  const [isMutilAnswer, setIsMutilAnswer] = useState<boolean>(false);

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
    const optionVal: QuestionTypeEnum = item.value as QuestionTypeEnum;
    setValue('type', optionVal);
    setValue('isActive', true);

    switch (item.value) {
      case QuestionTypeEnum.MULTIPLE: {
        setIsMutilAnswer(true);
        setShouldRemoveAnswers(false);
        break;
      }

      case QuestionTypeEnum.SINGLE: {
        setIsMutilAnswer(false);
        setShouldRemoveAnswers(false);
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
        if (createAnswerRef.current) {
          createAnswerRef.current.resetAnswers(resetAnswers);
        }
        break;
      }

      case QuestionTypeEnum.TEXT: {
        setShouldRemoveAnswers(true);
        clearErrors('answers');
        break;
      }

      default:
        break;
    }
  };

  const validAnswer = (): boolean => {
    const answers = getValues('answers');
    const questionType = getValues('type');
    const isQuestionTypeText = questionType === QuestionTypeEnum.TEXT;
    if (isQuestionTypeText) {
      return true;
    }
    // answers must have correct answer
    const haveCorrectAnswer = answers.some((answers: CreatAnswer) => {
      return answers.isCorrect;
    });

    const haveEmptyContent = answers.some((answers: CreatAnswer) => {
      return answers.content === '';
    });

    if (haveEmptyContent) {
      setError('answers', {
        message: 'Answers content is required',
      });
      return false;
    }

    if (haveCorrectAnswer === false) {
      notify({
        message: errNotSelectCorrectAnswer,
        type: 'danger',
      } as iNotification);
      return false;
    }
    return true;
  };

  // create Question
  const onSubmit: SubmitHandler<CreateQuestionDto> = async (formData) => {
    const isValidAnswer = validAnswer();
    if (isValidAnswer === false) {
      return;
    }

    try {
      const isQuestionTypeText = getValues('type') === QuestionTypeEnum.TEXT;
      // should remove answer if question type is TEXT
      if (isQuestionTypeText) {
        formData.answers.length = 0;
      }

      const { data } = await questionServices.createQuestion(formData);
      if (data.success) {
        const topicId = 1;
        const urlNavigate = '/tests/edit/' + topicId;
        navigate(urlNavigate);
      }
    } catch (error) {
      //
    }
  };

  const onAddAnswer = (answers: CreatAnswer[]) => {
    setValue('answers', answers);
    clearErrors('answers');
  };

  const onRemoveAnswer = (filterAnswer: CreatAnswer[]) => {
    clearErrors('answers');
    resetField('answers');
    const answers = getValues('answers');
    if (answers) {
      setValue('answers', filterAnswer);
      resetField('answers');
    }
  };

  const onChangeEditor = (value: string) => {
    if (hasContentEditor(value)) {
      clearErrors('content');
    } else {
      setError(
        'content',
        { message: 'Question content is a required field' },
        { shouldFocus: true }
      );
    }
    setValue('content', value);
  };

  return (
    <div className="container">
      <form
        className="form flex items-start"
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
            <Editor
              placeholder="Nội dung câu hỏi"
              className="h-[248px]"
              onChange={onChangeEditor}
              isError={Boolean(errors.content)}
              errMessage={errors.content?.message}
            />
          </div>
          <div
            className={classNames('create-answer', {
              hidden: shouldRemoveAnswers,
            })}
          >
            <CreateAnswer
              onAddAnswer={onAddAnswer}
              onRemoveAnswer={onRemoveAnswer}
              invalidAnswers={Boolean(errors.answers)}
              isMultilCorrectAnswer={isMutilAnswer}
              ref={createAnswerRef}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
