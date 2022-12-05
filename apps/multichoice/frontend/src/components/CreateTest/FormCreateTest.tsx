import React, { useRef, useState } from 'react';
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
import { topicServices } from '../../services/Title/TopicServices';
import { useNavigate } from 'react-router-dom';
import { topicStore } from '../../store/rootReducer';
import {
  minutesToSeconds,
  secondsToMinutes,
} from '../../utils/minutes_to_seconds';

const schemaFormCreateTest = yup.object().shape({
  timeType: yup.string().required(),
  typeCategoryName: yup.string().required(),
  title: yup.string().required(),
  description: yup.string(),
  isDraft: yup.boolean(),
  expirationTime: yup.number(),
});

const FormCreateTest: React.FC = () => {
  const navigate = useNavigate();
  const { setTopicData } = topicStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTopicDto>({
    resolver: yupResolver(schemaFormCreateTest),
    defaultValues: {
      description: '',
      expirationTime: secondsToMinutes(1000 * 60),
      isDraft: false,
      isPrivate: false,
      timeType: TopicTimeTypeEnum.FIXEDTIME,
      title: '',
      typeCategoryName: TopicCategoryEnum.PROGRAMMING,
    },
  });

  const [topicCategories] = useState<IOption[]>(() => {
    const topics: TopicCategoryEnum[] = [];
    for (const topic in TopicCategoryEnum) {
      const topicVal = topic as TopicCategoryEnum;
      topics.push(topicVal);
    }
    const options: IOption[] = topics.map((topic: TopicCategoryEnum) => ({
      label: topic,
      value: topic,
    }));
    return options;
  });

  const [topicTimeTypes] = useState<IOption[]>(() => {
    const timeTypes: TopicTimeTypeEnum[] = [];
    for (const types in TopicTimeTypeEnum) {
      const topicVal = types as TopicTimeTypeEnum;
      timeTypes.push(topicVal);
    }
    const options: IOption[] = timeTypes.map(
      (timeTypes: TopicTimeTypeEnum) => ({
        label: timeTypes,
        value: timeTypes,
      })
    );
    return options;
  });

  const onSelectCategory = (item: IOption) => {
    setValue('typeCategoryName', item.value as TopicCategoryEnum);
  };

  const onSelectTimeType = (item: IOption) => {
    setValue('timeType', item.value as TopicTimeTypeEnum);
  };

  // create TOPIC
  const onSubmit: SubmitHandler<CreateTopicDto> = async (formData) => {
    try {
      formData.expirationTime = minutesToSeconds(formData.expirationTime);
      const { data } = await topicServices.createTopic(formData);
      if (data.success) {
        const topicId = data.data.id;
        const urlNavigate = '/tests/edit/' + topicId;
        setTopicData(data.data);
        navigate(urlNavigate);
      }
    } catch (error) {
      //
    }
  };

  return (
    <div className="container">
      <form
        className="form flex items-start"
        onSubmit={handleSubmit(onSubmit)}
        id="form-create-test"
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
            onChange={onSelectCategory}
            defaultValue={topicCategories[0].label}
            options={topicCategories}
            textLabel="Chọn nhóm đề thi"
            className="mt-5"
          />

          <Select
            onChange={onSelectTimeType}
            defaultValue={topicTimeTypes[0].label}
            options={topicTimeTypes}
            textLabel="Loại thời gian"
            className="mt-5"
          />
        </div>
        <div className="form-right w-2/3 p-4 ml-4 bg-white rounded-md">
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
      </form>
    </div>
  );
};

export default FormCreateTest;
