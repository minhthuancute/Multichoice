import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import Input from '../Commons/Input/Input';
import Select from 'react-select';
import { TopicCategoryEnum } from '@monorepo/multichoice/constant';
import { useQuery } from '../../hooks/useQuery';
import { IFilter } from '../../services/Title/TopicServices';
import { topicStore } from '../../store/Topic/topicStore';

const schemaFormFilter = yup.object().shape({
  searchTerm: yup.string().required(),
  typeCategoryName: yup
    .mixed<TopicCategoryEnum>()
    .oneOf(Object.values(TopicCategoryEnum)),
});

const options = Object.values(TopicCategoryEnum).map((val) => {
  return {
    label: val,
    value: val,
  };
});

const FilterTests: React.FC = () => {
  const [query, setSearchParams] = useQuery<IFilter>();

  const { getTopics, getPublicTopics, isPublic } = topicStore();

  const { register, handleSubmit, setValue, getValues } = useForm<IFilter>({
    resolver: yupResolver(schemaFormFilter),
  });

  const getData = () => {
    if (isPublic) {
      getPublicTopics(
        {
          typeCategoryName: getValues('typeCategoryName'),
          searchTerm: getValues('searchTerm'),
        },
        {
          page: 1,
          take: 10,
        }
      );
    } else {
      getTopics(
        {
          typeCategoryName: getValues('typeCategoryName'),
          searchTerm: getValues('searchTerm'),
        },
        {
          page: 1,
          take: 10,
        }
      );
    }
  };

  const onSubmit: SubmitHandler<IFilter> = (formData) => {
    console.log('1111');
    setSearchParams({
      searchTerm: formData.searchTerm || '',
      typeCategoryName: formData.typeCategoryName || '',
    });
    console.log(formData);
    getData();
  };

  useEffect(() => {
    setValue('searchTerm', query.searchTerm);
    setValue('typeCategoryName', query.typeCategoryName);
  }, []);

  useEffect(() => {
    getData();
  }, [query.typeCategoryName, isPublic]);

  return (
    <form className="form-search-test flex items-center bg-white border border-solid border-stone-200 focus:border-primary-900 rounded-md">
      <Input
        className="flex-1"
        placeholder="Tìm kiếm đề thi"
        registerField={register('searchTerm')}
        inputSize="md"
        defaultValue={query.searchTerm}
        hasBorder={false}
        type={'submit'}
        onKeyDown={(e) => {
          console.log(e.key);
          if (e.key === 'Enter') {
            onSubmit(getValues());
          }
        }}
      />
      <div className="h-6 bg-stone-200 w-[1px]"></div>
      <Select
        components={{
          IndicatorSeparator: () => null,
        }}
        menuPlacement="auto"
        isSearchable={false}
        options={options}
        onChange={(option) => {
          // set category
          setValue(
            'typeCategoryName',
            (option?.value || '') as TopicCategoryEnum
          );

          // set query
          setSearchParams({
            ...query,
            typeCategoryName: option?.value as TopicCategoryEnum,
          });
        }}
        defaultValue={options.find(
          (option) => option.value === query.typeCategoryName
        )}
        placeholder="Chọn danh mục..."
        className="text-sm"
        styles={{
          menu: (base) => ({
            ...base,
            width: 'max-content',
            minWidth: '100%',
          }),
          control: (base) => ({
            ...base,
            border: '0 !important',
            // This line disable the blue border
            boxShadow: '0 !important',
            '&:hover': {
              border: '0 !important',
            },
            textAlign: 'right',
            position: 'static',
            transform: 'none',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#28c6d7' : 'inherit',
            '&:hover': {
              backgroundColor: '#28c6d7',
              color: 'white',
            },
          }),
        }}
      />
    </form>
  );
};

export default FilterTests;
