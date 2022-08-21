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
  title: string;
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
    console.log(searchParams);
    setSearchParams('?search=' + formData.title);
    if (onFilter) {
      onFilter(formData.title);
    }
  };

  return (
    <div>
      <form
        className="form-search-test flex items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          className="flex-1"
          placeholder="Tìm kiếm đề thi"
          registerField={register('title')}
          inputSize="md"
        />
        <button className="btn-primary bg-violet-600 text-white py-3.5 px-4 rounded-md ml-1">
          <BiSearchAlt />
        </button>
      </form>
    </div>
  );
};

export default FilterTests;
