import React, { useLayoutEffect, useRef, useState } from 'react';
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
import UpdateAnswer from '../CreateQuestion/UpdateAnswers';
import QuillEditor from '../QuillEditor/QuillEditor';
import { hasContentEditor } from '../../utils/emptyContentEditor';
import { IResetAnswersRef } from '../CreateQuestion/CreateAnswer';
import { topicServices } from '../../services/TopicServices';
import { useParams } from 'react-router-dom';
import { errNotSelectCorrectAnswer } from '../../constants/msgNotify';
import { classNames } from '../../helper/classNames';

const schemaFormUpdateQuestion = yup.object().shape({
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

interface IFormEditQuestion {
  questionData: IQuestion;
  setOpenModalEditQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IUpdateAnswer {
  content: string;
  isCorrect: boolean;
  id?: number;
}
export interface IUpdateQuestion {
  type: QuestionTypeEnum;
  content: string;
  time: number;
  isActive: boolean;
  answers: IUpdateAnswer[];
}

const FormEditQuestion: React.FC<IFormEditQuestion> = ({
  questionData,
  setOpenModalEditQuestion,
}) => {
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
  } = useForm<IUpdateQuestion>({
    resolver: yupResolver(schemaFormUpdateQuestion),
  });

  const [isMutilAnswer, setIsMutilAnswer] = useState<boolean>(false);
  const [shouldRemoveAnswers, setShouldRemoveAnswers] =
    useState<boolean>(false);

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

  const initForm = () => {
    const { type, content, time, isActive, answers } = questionData;
    if (type === QuestionTypeEnum.TEXT) {
      setShouldRemoveAnswers(true);
    }

    const isMutilAnswer: boolean = type === QuestionTypeEnum.MULTIPLE;
    setIsMutilAnswer(isMutilAnswer);

    setValue('type', type);
    setValue('content', content);
    setValue('time', time);
    setValue('isActive', isActive);
    setValue('answers', answers);
  };

  const getTopicDetail = async () => {
    try {
      const { data } = await topicServices.getTopicById(Number(id) || -1);
      setTopicDetailData(data);
    } catch {
      //
    }
  };

  const validAnswer = (): boolean => {
    const answers = getValues('answers');
    const isQuestionTypeText =
      getValues('type').toUpperCase() === QuestionTypeEnum.TEXT;
    // answers must have correct answer
    const haveCorrectAnswer =
      answers.some((answers: CreatAnswer) => {
        return answers.isCorrect;
      }) && !isQuestionTypeText;

    const haveEmptyContent =
      answers.some((answers: CreatAnswer) => {
        return answers.content === '';
      }) && !isQuestionTypeText;

    if (haveEmptyContent) {
      setError('answers', {
        message: 'Answers content is required',
      });
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

  // create Question
  const onSubmit: SubmitHandler<IUpdateQuestion> = async (
    formData: IUpdateQuestion
  ) => {
    const isValidAnswer = validAnswer();
    if (isValidAnswer === false) {
      return;
    }

    try {
      // should remove answer if question type is TEXT
      const isQuestionTypeText = getValues('type') === QuestionTypeEnum.TEXT;
      if (isQuestionTypeText) {
        formData.answers = [];
      }

      const { data } = await questionServices.updateQuestion(
        questionData.id,
        formData
      );

      if (data.success) {
        setOpenModalEditQuestion(false);
        getTopicDetail();
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

  useLayoutEffect(() => {
    initForm();
  }, []);

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
          {topic.typeCategoryName === 'GAME' ? (
            <Input
              registerField={register('time')}
              typeInput="number"
              textLabel="Thời gian làm bài"
              id="expirationTime"
              isError={Boolean(errors.time)}
              errMessage={errors.time?.message}
              isDisable={topic.typeCategoryName !== 'GAME'}
            />
          ) : null}
          <Select
            onChange={onSelectQuestionType}
            defaultValue={questionData.type}
            options={questionTypes}
            textLabel="Loại câu hỏi"
          />
        </div>
        <div className="bg-white rounded-md mt-5">
          <QuillEditor
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
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
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

export default FormEditQuestion;
