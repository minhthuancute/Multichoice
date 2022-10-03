import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { BiSearchAlt } from 'react-icons/bi';
import Input from '../Commons/Input/Input';
import { useSearchParams } from 'react-router-dom';

const schemaFormFilter = yup.object().shape({
  title: yup.string(),
});

interface IFormFilterTest {
  title: string; // keyword search Test
}

interface IFilterTests {
  onFilter?: (keyword: string) => void;
}

const FilterTests: React.FC<IFilterTests> = ({ onFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit } = useForm<IFormFilterTest>({
    resolver: yupResolver(schemaFormFilter),
  });

  const onSubmit: SubmitHandler<IFormFilterTest> = (
    formData: IFormFilterTest
  ) => {
    setSearchParams('?search=' + formData.title);
    if (onFilter) {
      onFilter(formData.title);
    }
  };

  return (
    <div className="filter-test">
      <form
        className="form-search-test flex items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          className="w-1/3"
          placeholder="Tìm kiếm đề thi"
          registerField={register('title')}
          inputSize="md"
          defaultValue={searchParams.get('search')}
        />
        <button className="btn-primary bg-slate-500 text-white py-3.5 px-4 rounded-md ml-1">
          <BiSearchAlt />
        </button>
      </form>
    </div>
  );
};

export default FilterTests;
