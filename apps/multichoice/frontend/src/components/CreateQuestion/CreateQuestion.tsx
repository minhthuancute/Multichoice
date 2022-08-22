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
import { CreateTopicDto } from '@monorepo/multichoice/dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { IOption } from '../Commons/Select/Select';
import {
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import { topicServices } from '../../services/TopicServices';
import { useNavigate } from 'react-router-dom';

const schemaFormLogin = yup.object().shape({
  topicID: yup.number().required(),
  questionTypeID: yup.number().required(),
  content: yup.string().required(),
  time: yup.number().required(),
  isActive: yup.boolean(),
  answers: yup.object().shape<any>([
    {
      content: yup.string().required(),
      isCorrect: yup.boolean(),
    },
  ]),
});

interface IFormCreateTest {
  ref: any;
}

const FormCreateQuestion: React.FC<IFormCreateTest> = forwardRef(
  (props, ref) => {
    const navigate = useNavigate();
    const formRef: any = useRef<HTMLFormElement>(null);

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<CreateTopicDto>({
      resolver: yupResolver(schemaFormLogin),
    });

    const [topicCategories] = useState<IOption[]>(() => {
      const topics: TopicCategoryEnum[] = [];
      for (const topic in TopicCategoryEnum) {
        const topicVal = topic.toLocaleLowerCase() as TopicCategoryEnum;
        topics.push(topicVal);
      }
      const options: IOption[] = topics.map((topic: TopicCategoryEnum) => {
        return {
          label: topic,
          value: topic,
        };
      });
      return options;
    });

    const [topicTimeTypes] = useState<IOption[]>(() => {
      const timeTypes: TopicTimeTypeEnum[] = [];
      for (const types in TopicTimeTypeEnum) {
        const topicVal = types.toLocaleLowerCase() as TopicTimeTypeEnum;
        timeTypes.push(topicVal);
      }
      const options: IOption[] = timeTypes.map(
        (timeTypes: TopicTimeTypeEnum) => {
          return {
            label: timeTypes,
            value: timeTypes,
          };
        }
      );
      return options;
    });

    const initForm = () => {
      const optionVal: TopicCategoryEnum = topicCategories[0]
        .value as TopicCategoryEnum;
      setValue('timeType', TopicTimeTypeEnum.FIXEDTIME);
      setValue('typeCategoryName', optionVal);
    };

    useLayoutEffect(() => {
      initForm();
    }, []);

    const onSelectCategory = (item: IOption) => {
      const optionVal: TopicCategoryEnum = item.value as TopicCategoryEnum;
      setValue('typeCategoryName', optionVal);
    };

    const onSelectTimeType = (item: IOption) => {
      const optionVal: TopicTimeTypeEnum = item.value as TopicTimeTypeEnum;
      setValue('timeType', optionVal);
    };

    // create TOPIC
    const onSubmit: SubmitHandler<CreateTopicDto> = async (
      formData: CreateTopicDto
    ) => {
      try {
        const { data } = await topicServices.createTopic(formData);
        console.log(data);
        if (data.success) {
          const topicId = data.data.id;
          const urlNavigate = '/tests/edit/' + topicId;
          navigate(urlNavigate);
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
              registerField={register('expirationTime')}
              typeInput="number"
              textLabel="Thời gian làm bài"
              id="expirationTime"
              isError={Boolean(errors.expirationTime)}
              errMessage={errors.expirationTime?.message}
            />

            <Select
              onChange={onSelectCategory}
              defaultValue={topicCategories[0].label}
              options={topicCategories}
              textLabel="Loại câu hỏi"
              className="mt-5"
            />
          </div>
          <div className="form-right w-2/3 p-4 bg-white rounded-md">
            <TextArea
              registerField={register('description')}
              textLabel="Câu hỏi"
              placeholder="Nội dung câu hỏi"
              className=""
              classNameTextarea="h-[248px]"
              isError={Boolean(errors.description)}
              errMessage={errors.description?.message}
              isRequired={true}
            />
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
