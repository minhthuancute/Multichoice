import React, { useLayoutEffect, useState } from 'react';
import * as yup from 'yup';

import { CreateTopicDto } from '@monorepo/multichoice/dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import { useParams } from 'react-router-dom';
import Select, { IOption } from '../../../components/Commons/Select/Select';
import { topicServices } from '../../../services/TopicServices';
import Input from '../../../components/Commons/Input/Input';
import TextArea from '../../../components/Commons/TextArea/TextArea';
import { IoMdClose } from 'react-icons/io';
import ToolTip from '../../../components/Commons/ToolTip/ToolTip';
import { topicStore } from '../../../store/rootReducer';
import {
  minutesToSeconds,
  secondsToMinutes,
} from '../../../utils/minutesToSeconds';

const schemaFormLogin = yup.object().shape({
  timeType: yup.string().required(),
  typeCategoryName: yup.string().required(),
  title: yup.string().required(),
  description: yup.string(),
  isDraft: yup.boolean(),
  expirationTime: yup.number(),
});

interface IFormEditTest {
  setOpenModalEditTest: React.Dispatch<React.SetStateAction<boolean>>;
  cbOnUpdateTopic: () => void;
}

const FormEditTest: React.FC<IFormEditTest> = ({
  setOpenModalEditTest,
  cbOnUpdateTopic,
}) => {
  const { id: topicId } = useParams();

  const { topic } = topicStore();
  const { expirationTime, typeCategoryName, timeType, title, description } =
    topic;

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
    const options: IOption[] = timeTypes.map((timeTypes: TopicTimeTypeEnum) => {
      return {
        label: timeTypes,
        value: timeTypes,
      };
    });
    return options;
  });

  const initForm = () => {
    const timeType = topic.timeType as TopicTimeTypeEnum;
    const typeCategoryName = topic.typeCategoryName as TopicCategoryEnum;
    setValue('timeType', timeType);
    setValue('typeCategoryName', typeCategoryName);
    setValue('title', title);
    setValue('description', description || '');
    setValue('expirationTime', +secondsToMinutes(+expirationTime));
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
      formData.expirationTime = minutesToSeconds(formData.expirationTime);
      const id = topicId || -1;
      const { data } = await topicServices.updateTopicById(+id, formData);
      if (data.success) {
        setOpenModalEditTest(false);
        cbOnUpdateTopic();
      }
    } catch (error) {}
  };

  return (
    <div className="max-w-xl w-full h-max py-4 px-5 mx-auto rounded-md bg-white">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-header flex items-center justify-between mb-8">
          <h4 className="text-slate-800 text-xl font-semibold">
            Cập nhật đề thi
          </h4>
          <ToolTip title="Đóng">
            <button
              type="button"
              className="text-lg"
              onClick={() => setOpenModalEditTest(false)}
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
          <button
            type="button"
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-slate-800 font-bold border border-solid border-slate-800"
            onClick={() => setOpenModalEditTest(false)}
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

export default FormEditTest;
