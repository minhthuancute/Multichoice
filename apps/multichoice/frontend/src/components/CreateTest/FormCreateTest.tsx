import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Input from '../Commons/Input/Input';
import TextArea from '../Commons/TextArea/TextArea';
import * as yup from 'yup';
import { CreateTopicDto } from '@monorepo/multichoice/dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { IOption } from '../Commons/Select/Select';
import {
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';

const schemaFormLogin = yup.object().shape({
  timeTpye: yup.string().required(),
  typeCategoryName: yup.string().required(),
  title: yup.string().required(),
  description: yup.string(),
  isDraft: yup.boolean(),
  expirationTime: yup.number(),
});

interface IFormCreateTest {
  ref: any;
  shouldSubmit: boolean;
}

const FormCreateTest: React.FC<IFormCreateTest> = forwardRef(
  ({ shouldSubmit }, ref) => {
    const formRef: any = useRef<HTMLFormElement>(null);

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
    } = useForm<CreateTopicDto>({
      resolver: yupResolver(schemaFormLogin),
    });

    const [categories] = useState<IOption[]>(() => {
      const topics: TopicCategoryEnum[] = [
        TopicCategoryEnum.GAME,
        TopicCategoryEnum.ENGLISH,
        TopicCategoryEnum.PROGRAMMING,
        TopicCategoryEnum.BUSINESS,
        TopicCategoryEnum.NONE,
      ];
      const options: IOption[] = topics.map((topic: TopicCategoryEnum) => {
        return {
          label: topic,
          value: topic,
        };
      });
      return options;
    });

    const initForm = () => {
      const optionVal: TopicCategoryEnum = categories[0]
        .value as TopicCategoryEnum;
      // reset({
      //   timeTpye: TopicTimeTypeEnum.FIXEDTIME,
      //   typeCategoryName: optionVal,
      // });
      setValue('timeTpye', TopicTimeTypeEnum.FIXEDTIME);
      setValue('typeCategoryName', optionVal);
    };

    useLayoutEffect(() => {
      initForm();
    }, []);

    const onSelect = (item: IOption) => {
      const optionVal: TopicCategoryEnum = item.value as TopicCategoryEnum;
      // reset({
      //   typeCategoryName: optionVal,
      // });
      setValue('typeCategoryName', optionVal);
    };

    const onSubmit: SubmitHandler<CreateTopicDto> = async (
      formData: CreateTopicDto
    ) => {
      console.log('ascjksaj', formData);
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
              defaultValue={10}
              typeInput="number"
              textLabel="Thời gian làm bài (phút)"
              id="expirationTime"
              isError={Boolean(errors.expirationTime)}
              errMessage={errors.expirationTime?.message}
            />

            <Select
              onChange={onSelect}
              defaultValue={categories[0].label}
              options={categories}
              textLabel="Chọn nhóm đề thi"
              className="mt-5"
            />
          </div>
          <div className="form-right w-2/3 p-4 bg-white rounded-md">
            <Input
              registerField={register('title')}
              textLabel="Tên đề thi"
              id="testName"
              placeholder="Tên đề thi"
              isRequired={true}
              isError={Boolean(errors.title)}
              errMessage={errors.title?.message}
            />

            <TextArea
              registerField={register('description')}
              textLabel="Mô tả"
              placeholder="Không bắt buộc"
              className="mt-5"
              classNameTextarea="h-[200px]"
              isError={Boolean(errors.description)}
              errMessage={errors.description?.message}
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

export default FormCreateTest;
