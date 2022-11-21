import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import Input from '../Commons/Input/Input';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { TopicCategoryEnum } from '@monorepo/multichoice/constant';

interface IFormFilterTest {
  searchTerm: string; // keyword search Test
  category: string; // category search
}

interface IFilterTests {
  onFilter?: (keyword: string) => void;
}

const schemaFormFilter = yup.object().shape({
  searchTerm: yup.string().required(),
  category: yup
    .mixed<TopicCategoryEnum>()
    .oneOf(Object.values(TopicCategoryEnum)),
});

const options = Object.values(TopicCategoryEnum).map((val) => {
  return {
    label: val,
    value: val,
  };
});

const FilterTests: React.FC<IFilterTests> = ({ onFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit, setValue } = useForm<IFormFilterTest>({
    resolver: yupResolver(schemaFormFilter),
  });

  const onSubmit: SubmitHandler<IFormFilterTest> = (
    formData: IFormFilterTest
  ) => {
    setSearchParams('?search=' + formData.searchTerm);
    if (onFilter) {
      onFilter(formData.searchTerm);
    }
  };
  return (
    <div className="filter-test">
      <form
        className="form-search-test flex items-center bg-white border border-solid border-stone-200 focus:border-primary-900 rounded-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          className="flex-1"
          placeholder="Tìm kiếm đề thi"
          registerField={register('searchTerm')}
          inputSize="md"
          defaultValue={searchParams.get('search')}
          hasBorder={false}
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
            setValue('category', option?.value || '');
          }}
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
          }}
        />
      </form>
    </div>
  );
};

export default FilterTests;
