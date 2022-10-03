import React, { ChangeEvent, FormEvent, useState } from 'react';
import Select from '../Commons/Select/Select';

type TypeSortOption = 'NEW' | 'ALPHABET' | 'POINT';

interface ISortOptions {
  label: string;
  value: TypeSortOption;
}

interface IFilterStatisticExamProps {
  demo?: number;
}

const FilterStatisticExam: React.FC<IFilterStatisticExamProps> = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const sortOptions: ISortOptions[] = [
    {
      label: 'Mới nhất',
      value: 'NEW',
    },
    {
      label: 'A - Z',
      value: 'ALPHABET',
    },
    {
      label: 'Điểm cao',
      value: 'ALPHABET',
    },
  ];

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="filter-statistic mt-4">
      <div className="search-user">
        {/* <Input
          className="w-1/3"
          placeholder="Tìm kiếm đề thi"
          inputSize="md"
          defaultValue={searchParams.get('search')}
        /> */}
      </div>
      <div className="sort-by">
        <Select
          options={sortOptions}
          defaultValue={sortOptions[0].label}
          className="text-sm capitalize w-32 bg-white"
          placementOptions="RIGHT"
        />
      </div>
    </div>
  );
};

export default FilterStatisticExam;
