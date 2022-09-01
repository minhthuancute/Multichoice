import { TopicCategoryEnum } from '@monorepo/multichoice/constant';
import React from 'react';
import { classNames } from '../../../helper/classNames';

type CategoryType = keyof typeof TopicCategoryEnum;

interface IBadge {
  type?: CategoryType;
  className?: string;
  title?: string;
}

const Badge: React.FC<IBadge> = ({
  type = 'PROGRAMMING',
  className = '',
  title = '',
}) => {
  const badgeColor = (type: CategoryType = 'NONE'): string => {
    const colorTypes = {
      BUSINESS: 'text-green-500',
      ENGLISH: 'text-violet-500',
      GAME: 'text-cyan-500',
      PROGRAMMING: 'text-red-500',
      NONE: 'text-yellow-300',
    };
    const upperType = type.toUpperCase() as CategoryType;
    return colorTypes[upperType] || '';
  };

  return (
    <div
      className={classNames([
        'px-1.5 text-xs font-semibold capitalize',
        badgeColor(type),
      ])}
    >
      <span>{title}</span>
    </div>
  );
};

export default Badge;
