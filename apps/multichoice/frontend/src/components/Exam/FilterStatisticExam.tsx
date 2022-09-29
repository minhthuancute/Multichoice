import React from 'react';
import Select, { IOption } from '../Commons/Select/Select';

type TypeSortOption = 'NEW' | 'ALPHABET' | 'POINT';

interface ISortOptions {
  label: string;
  value: TypeSortOption;
}

interface IFilterStatisticExamProps {
  demo?: number;
}

const FilterStatisticExam: React.FC<IFilterStatisticExamProps> = () => {
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

  return (
    <div>
      <div className="sort-by">
        <Select
          options={sortOptions}
          defaultValue={sortOptions[0].label}
          className="text-sm font-semibold capitalize"
          placementOptions="RIGHT"
        />
      </div>
    </div>
  );
};

export default FilterStatisticExam;
