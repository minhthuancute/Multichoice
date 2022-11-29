import React, { useRef, useState } from 'react';
import * as yup from 'yup';
import Input from '../Commons/Input/Input';
import { CreatAnswer } from '@monorepo/multichoice/dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { IOption } from '../Commons/Select/Select';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { questionServices } from '../../services/QuestionServices';
import { topicStore } from '../../store/rootReducer';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { IoMdClose } from 'react-icons/io';
import { IQuestion } from '../../types';
import UpdateAnswer from '../UpdateAnswers/UpdateAnswers';
import Editor from '../Editor/Editor';
import { hasContentEditor } from '../../utils/empty_content_editor';
import { IResetAnswersRef } from '../CreateAnswer/CreateAnswer';
import { useParams } from 'react-router-dom';
import { errNotSelectCorrectAnswer } from '../../constants/msgNotify';
import { classNames } from '../../helper/classNames';
import { topicServices } from '../../services/TopicServices';

const schemaUpdateQuestion = yup.object().shape({
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

export interface IUpdateAnswer {
  content: string;
  isCorrect: boolean;
  id?: number;
}

export interface IUpdateQuestionPayload {
  type: QuestionTypeEnum;
  content: string;
  time: number;
  isActive: boolean;
  answers: IUpdateAnswer[];
}

interface IUpdateQuestionProps {
  questionData: IQuestion;
  setOpenModalEditQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateQuestion: React.FC<IUpdateQuestionProps> = ({
  questionData,
  setOpenModalEditQuestion,
}) => {
  const { type, content, time, isActive, answers } = questionData;

  const { id } = useParams();
  const { topic, setTopicDetailData } = topicStore();
  const updateAnswerRef = useRef<IResetAnswersRef>();

  const {
    resetField,
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<IUpdateQuestionPayload>({
    resolver: yupResolver(schemaUpdateQuestion),
    defaultValues: {
      type,
      content,
      time,
      isActive,
      answers,
    },
  });

  const [isMutilAnswer, setIsMutilAnswer] = useState<boolean>(
    type === QuestionTypeEnum.MULTIPLE
  );
  const [shouldRemoveAnswers, setShouldRemoveAnswers] = useState<boolean>(
    type === QuestionTypeEnum.TEXT
  );

  const [optionsQuestionType] = useState<IOption[]>(() => {
    const types = Object.values(QuestionTypeEnum).map((type) => {
      return {
        label: type,
        value: type,
      };
    });
    return types;
  });

  const getTopicDetail = async () => {
    try {
      const { data } = await topicServices.getTopicById(Number(id));
      setTopicDetailData(data);
    } catch {
      //
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
  const onSubmit: SubmitHandler<IUpdateQuestionPayload> = async (formData) => {
    const isValidAnswer = validAnswer();
    if (isValidAnswer === false) {
      return;
    }

    try {
      // should remove answer if question type is TEXT
      const isQuestionTypeText = getValues('type') === QuestionTypeEnum.TEXT;
      if (isQuestionTypeText) {
        formData.answers.length = 0;
      }

      const { data } = await questionServices.updateQuestion(
        questionData.id,
        formData
      );

      if (data.success) {
        getTopicDetail();
        setOpenModalEditQuestion(false);
      }
    } catch (error) {
      //
    }
  };

  const onAddAnswer = (answers: IUpdateAnswer[]) => {
    setValue('answers', answers);
    clearErrors('answers');
  };

  const onRemoveAnswer = (filterAnswer: IUpdateAnswer[]) => {
    resetField('answers');

    const answers = getValues('answers');
    if (answers) {
      setValue('answers', filterAnswer);
      resetField('answers');
    }
  };

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
        if (updateAnswerRef.current) {
          updateAnswerRef.current.resetAnswers(resetAnswers);
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
    <div className="py-4 px-5 mx-auto rounded-md bg-white">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-header flex items-center justify-between mb-8">
          <h4 className="text-slate-800 text-xl font-semibold">
            Cập nhật câu hỏi
          </h4>
          <ToolTip title="Đóng">
            <button
              type="button"
              className="text-lg"
              onClick={() => setOpenModalEditQuestion(false)}
            >
              <IoMdClose />
            </button>
          </ToolTip>
        </div>

        <div className="bg-white rounded-md">
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
            options={optionsQuestionType}
            textLabel="Loại câu hỏi"
          />
        </div>
        <div className="bg-white rounded-md mt-5">
          <Editor
            placeholder="Nội dung câu hỏi"
            className="h-[248px]"
            onChange={onChangeEditor}
            isError={Boolean(errors.content)}
            errMessage={errors.content?.message}
            defaultValue={questionData.content}
          />
          <div
            className={classNames('create-answer', {
              hidden: shouldRemoveAnswers,
            })}
          >
            <UpdateAnswer
              isMultilCorrectAnswer={isMutilAnswer}
              answers={
                questionData.answers.length
                  ? questionData.answers
                  : ([
                      {
                        content: '',
                        isCorrect: false,
                      },
                      {
                        content: '',
                        isCorrect: false,
                      },
                    ] as CreatAnswer[])
              }
              onAddAnswer={onAddAnswer}
              onRemoveAnswer={onRemoveAnswer}
              invalidAnswers={Boolean(errors.answers)}
              ref={updateAnswerRef}
            />
          </div>
        </div>

        <div className="ctas flex items-center justify-end gap-x-2 mt-8">
          <button
            type="button"
            className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-slate-800 font-bold border border-solid border-slate-800"
            onClick={() => setOpenModalEditQuestion(false)}
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateQuestion;
