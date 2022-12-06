import React, { useState } from 'react';
import * as yup from 'yup';

import { CreateTopicDto } from '@monorepo/multichoice/dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import { useParams } from 'react-router-dom';
import Select, { IOption } from '../Commons/Select/Select';
import { topicServices } from '../../services/Title/TopicServices';
import Input from '../Commons/Input/Input';
import TextArea from '../Commons/TextArea/TextArea';
import { IoMdClose } from 'react-icons/io';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { topicStore } from '../../store/rootReducer';
import {
  minutesToSeconds,
  secondsToMinutes,
} from '../../utils/minutes_to_seconds';
import Button from '../Commons/Button/Button';
import { ITopic } from '../../types';

const schemaFormEditTest = yup.object().shape({
  timeType: yup.string().required(),
  typeCategoryName: yup.string().required(),
  title: yup.string().required(),
  description: yup.string(),
  isDraft: yup.boolean(),
  expirationTime: yup.number(),
});

interface IFormEditTestProps {
  setVisibleModalEditTest: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormEditTest: React.FC<IFormEditTestProps> = ({
  setVisibleModalEditTest,
}) => {
  const { id } = useParams();

  const { topic, getTopic } = topicStore();
  const { expirationTime, typeCategoryName, timeType, title, description } =
    topic;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTopicDto>({
    resolver: yupResolver(schemaFormEditTest),
    defaultValues: {
      description: description || '',
      expirationTime: +secondsToMinutes(+expirationTime),
      isDraft: false,
      isPrivate: false,
      timeType: topic.timeType as TopicTimeTypeEnum,
      title: title,
      typeCategoryName: topic.typeCategoryName as TopicCategoryEnum,
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
    const optionVal: TopicCategoryEnum = item.value as TopicCategoryEnum;
    setValue('typeCategoryName', optionVal);
  };

  const onSelectTimeType = (item: IOption) => {
    const optionVal: TopicTimeTypeEnum = item.value as TopicTimeTypeEnum;
    setValue('timeType', optionVal);
  };

  const getTopicById = async () => {
    try {
      const { data }: { data: ITopic } = await topicServices.getTopicById(
        Number(id)
      );
      if (data) {
        // setTopicDetail(data);
      }
    } catch (error) {
      //
    }
  };

  // create TOPIC
  const onSubmit: SubmitHandler<CreateTopicDto> = async (
    formData: CreateTopicDto
  ) => {
    try {
      formData.expirationTime = minutesToSeconds(formData.expirationTime);
      const { data } = await topicServices.updateTopicById(
        Number(id),
        formData
      );
      if (data.success) {
        setVisibleModalEditTest(false);
        getTopicById();
      }
    } catch (error) {
      //
    }
  };

  return (
    <div className="rounded-md bg-white">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-header flex items-center justify-between mb-8">
          <h4 className="text-slate-800 text-xl font-semibold">
            Cập nhật đề thi
          </h4>
          <ToolTip title="Đóng">
            <button
              type="button"
              className="text-lg"
              onClick={() => setVisibleModalEditTest(false)}
            >
              <IoMdClose />
            </button>
          </ToolTip>
        </div>
        <Input
          registerField={register('expirationTime')}
          defaultValue={+secondsToMinutes(+expirationTime)}
          typeInput="number"
          textLabel="Thời gian làm bài (phút)"
          id="expirationTime"
          isError={Boolean(errors.expirationTime)}
          errMessage={errors.expirationTime?.message}
        />

        <Select
          onChange={onSelectCategory}
          defaultValue={typeCategoryName}
          options={topicCategories}
          textLabel="Chọn nhóm đề thi"
          className="mt-5"
        />

        <Select
          onChange={onSelectTimeType}
          defaultValue={timeType}
          options={topicTimeTypes}
          textLabel="Loại thời gian"
          className="mt-5"
        />

        <Input
          defaultValue={title}
          registerField={register('title')}
          textLabel="Tên đề thi"
          id="testName"
          placeholder="Tên đề thi"
          isRequired={true}
          isError={Boolean(errors.title)}
          errMessage={errors.title?.message}
          className="mt-5"
        />

        <TextArea
          defaultValue={description}
          registerField={register('description')}
          textLabel="Mô tả"
          placeholder="Không bắt buộc"
          className="mt-5"
          classNameTextarea="h-[200px]"
          isError={Boolean(errors.description)}
          errMessage={errors.description?.message}
        />

        <div className="ctas flex items-center justify-end gap-x-2 mt-8">
          <Button type="button" onClick={() => setVisibleModalEditTest(false)}>
            Huỷ
          </Button>
          <Button type="submit" color="success">
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormEditTest;
