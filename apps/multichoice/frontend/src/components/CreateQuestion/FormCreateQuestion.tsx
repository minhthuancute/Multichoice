import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import * as yup from 'yup';
import Input from '../Commons/Input/Input';
import TextArea from '../Commons/TextArea/TextArea';
import { CreateQuestionDto } from '@monorepo/multichoice/dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { IOption } from '../Commons/Select/Select';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { useNavigate } from 'react-router-dom';
import { questionServices } from '../../services/QuestionServices';
import CreateAnswer from './CreateAnswer';

interface IDemo {
  topicID: number;
  questionTypeID: number;
  content: string;
  time: number;
  isActive: boolean;
  answers: {
    content: string;
    isCorrect: boolean;
  }[];
}

const schemaFormLogin = yup.object().shape({
  topicID: yup.number(),
  questionTypeID: yup.number().required(),
  content: yup.string().required(),
  time: yup.number().required(),
  isActive: yup.boolean(),
  answers: yup.array().of(
    yup.object().shape({
      content: yup.string().required(),
      isCorrect: yup.boolean(),
    })
  ),
});

interface ICreateQuestion {
  ref: any;
}

// type IPayloadCreateQuestion = typeof schemaFormLogin;

const FormCreateQuestion: React.FC<ICreateQuestion> = forwardRef(
  (props, ref) => {
    const navigate = useNavigate();
    const formRef: any = useRef<HTMLFormElement>(null);

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<CreateQuestionDto>({
      resolver: yupResolver(schemaFormLogin),
    });

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
      setValue('type', QuestionTypeEnum.SINGLE);
      // setValue('time', 30 * 1000);
    };

    useLayoutEffect(() => {
      initForm();
    }, []);

    const onSelectQuestionType = (item: IOption) => {
      const optionVal: QuestionTypeEnum = item.value as QuestionTypeEnum;
      setValue('type', optionVal);
    };

    // create Question
    const onSubmit: SubmitHandler<CreateQuestionDto> = async (
      formData: CreateQuestionDto
    ) => {
      try {
        const { data } = await questionServices.createQuestion(formData);
        if (data.success) {
          console.log(data);
          // const topicId = data.data.id;
          // const urlNavigate = '/tests/edit/' + topicId;
          // navigate(urlNavigate);
        }
      } catch (error) {
        console.log(error);
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        submitForm: () => {
          formRef.current.click();
        },
      }),
      []
    );

    return (
      <div className="container">
        <form
          className="form flex items-start gap-x-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-left w-1/3 p-4 bg-white rounded-md">
            <Input
              registerField={register('time')}
              typeInput="number"
              textLabel="Thời gian làm bài"
              id="expirationTime"
              isError={Boolean(errors.time)}
              errMessage={errors.time?.message}
            />

            <Select
              onChange={onSelectQuestionType}
              defaultValue={questionTypes[0].label}
              options={questionTypes}
              textLabel="Loại câu hỏi"
              className="mt-5"
            />
          </div>
          <div className="form-right w-2/3 p-4 bg-white rounded-md">
            <TextArea
              registerField={register('content')}
              textLabel="Câu hỏi"
              placeholder="Nội dung câu hỏi"
              className=""
              classNameTextarea="h-[248px]"
              isError={Boolean(errors.content)}
              errMessage={errors.content?.message}
              isRequired={true}
            />
            <CreateAnswer />
          </div>

          <div className="submit">
            <button ref={formRef} hidden></button>
          </div>
        </form>
      </div>
    );
  }
);

export default FormCreateQuestion;
