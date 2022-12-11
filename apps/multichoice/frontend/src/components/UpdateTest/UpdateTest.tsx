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
import { topicStore } from '../../store/rootReducer';
import {
  minutesToSeconds,
  secondsToMinutes,
} from '../../utils/minutes_to_seconds';
import Button from '../Commons/Button/Button';
import { enumToOptions } from '../../utils/enum_to_options';

const schemaUpdateTest = yup.object().shape({
  timeType: yup.string().required(),
  typeCategoryName: yup.string().required(),
  title: yup.string().required(),
  description: yup.string(),
  isDraft: yup.boolean(),
  expirationTime: yup.number(),
});

interface IFormUpdateTestProps {
  setVisibleModalEditTest: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateTest: React.FC<IFormUpdateTestProps> = ({
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
    resolver: yupResolver(schemaUpdateTest),
    defaultValues: {
      description: description || '',
      expirationTime: +secondsToMinutes(+expirationTime),
      isDraft: false,
      isPublic: false,
      timeType: topic.timeType as TopicTimeTypeEnum,
      title: title,
      typeCategoryName: topic.typeCategoryName as TopicCategoryEnum,
    },
  });

  const [topicCategories] = useState<IOption[]>(
    enumToOptions(TopicCategoryEnum)
  );
  const [topicTimeTypes] = useState<IOption[]>(
    enumToOptions(TopicTimeTypeEnum)
  );

  const onSelectCategory = (item: IOption) => {
    const optionVal: TopicCategoryEnum = item.value as TopicCategoryEnum;
    setValue('typeCategoryName', optionVal);
  };

  const onSelectTimeType = (item: IOption) => {
    const optionVal: TopicTimeTypeEnum = item.value as TopicTimeTypeEnum;
    setValue('timeType', optionVal);
  };

  const onSubmit: SubmitHandler<CreateTopicDto> = async (formData) => {
    try {
      formData.expirationTime = minutesToSeconds(formData.expirationTime);
      const { data } = await topicServices.updateTopicById(
        Number(id),
        formData
      );
      if (data.success) {
        setVisibleModalEditTest(false);
        getTopic(Number(id));
      }
    } catch (error) {
      //
    }
  };

  return (
    <div className="rounded-md bg-white">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaultValue={description || ''}
          registerField={register('description')}
          textLabel="Mô tả"
          placeholder="Không bắt buộc"
          className="mt-5"
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

export default UpdateTest;
