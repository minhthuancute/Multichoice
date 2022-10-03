import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import * as yup from 'yup';
import Input from '../Commons/Input/Input';
import { CreatAnswer, CreateQuestionDto } from '@monorepo/multichoice/dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { IOption } from '../Commons/Select/Select';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { useNavigate } from 'react-router-dom';
import { questionServices } from '../../services/QuestionServices';
import CreateAnswer, { IResetAnswersRef } from './CreateAnswer';
import { topicStore } from '../../store/rootReducer';
import { useQuery } from '../../hooks/useQuery';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import QuillEditor from '../QuillEditor/QuillEditor';
import { hasContentEditor } from '../../utils/emptyContentEditor';
import { classNames } from '../../helper/classNames';

const schemaFormCreateQuestion = yup.object().shape({
  topicID: yup.number(),
  content: yup.string().required('Question content is a required field'),
  time: yup.number(),
  isActive: yup.boolean(),
  answers: yup.array().of(
    yup.object().shape({
      content: yup.string().required(),
      isCorrect: yup.boolean(),
    })
  ),
});

export interface IFormCreateQuestionRef {
  submitFormCreateAnswer: () => void;
}

interface ICreateQuestion {
  ref: any;
}

const FormCreateQuestion: React.FC<ICreateQuestion> = forwardRef(
  (props, ref) => {
    const navigate = useNavigate();
    const query = useQuery();
    const { topic } = topicStore();
    const submitBtnRef: any = useRef<HTMLButtonElement>(null);

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
      reset,
      formState: { errors },
    } = useForm<CreateQuestionDto>({
      resolver: yupResolver(schemaFormCreateQuestion),
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

    const initForm = () => {
      const topicId = query.get('topic_id') || -1;
      setValue('content', '');
      setValue('type', QuestionTypeEnum.SINGLE);
      setValue('time', 0);
      setValue('isActive', true);
      setValue('topicID', +topicId);
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
          if (createAnswerRef.current) {
            createAnswerRef.current.resetAnswers(resetAnswers);
          }
          break;
        }

        case QuestionTypeEnum.TEXT: {
          setShouldRemoveAnswers(true);
          break;
        }

        default:
          break;
      }
    };

    // create Question
    const onSubmit: SubmitHandler<CreateQuestionDto> = async (
      formData: CreateQuestionDto
    ) => {
      try {
        const answers = getValues('answers');

        const validAnswers = answers.some((answers: CreatAnswer) => {
          return answers.isCorrect;
        });
        if (!validAnswers) {
          notify({
            message: 'Bạn chưa chọn đáp án đúng cho câu hỏi !',
            type: 'danger',
          } as iNotification);
          return;
        }

        const { data } = await questionServices.createQuestion(formData);
        if (data.success) {
          const topicId = query.get('topic_id') || -1;
          const urlNavigate = '/tests/edit/' + topicId;
          navigate(urlNavigate);
        }
      } catch (error) {
        //
      }
    };

    const onAddAnswer = (answers: CreatAnswer[]) => {
      clearErrors('answers');
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

    useImperativeHandle(
      ref,
      () => ({
        submitFormCreateAnswer: () => {
          submitBtnRef.current.click();
        },
      }),
      []
    );

    useLayoutEffect(() => {
      initForm();
    }, []);

    return (
      <div className="container">
        <form
          className="form flex items-start"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-left w-1/3 p-4 bg-white rounded-md">
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
              defaultValue={questionTypes[0].label}
              options={questionTypes}
              textLabel="Loại câu hỏi"
            />
          </div>
          <div className="form-right w-2/3 ml-4 p-4 bg-white rounded-md">
            <div className="relative">
              <QuillEditor
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

          <div className="submit">
            <button ref={submitBtnRef} hidden></button>
          </div>
        </form>
      </div>
    );
  }
);

export default FormCreateQuestion;
