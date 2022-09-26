import React from 'react';
import { classNames } from '../../../helper/classNames';
import { TopicCategoryType } from '../../../types/ICommons';

interface IBadge {
  type?: TopicCategoryType;
  className?: string;
  title?: string;
}

const Badge: React.FC<IBadge> = ({
  type = 'PROGRAMMING',
  className = '',
  title = '',
}) => {
  const badgeColor = (type: TopicCategoryType = 'NONE'): string => {
    const colorTypes = {
      BUSINESS: 'text-green-500',
      ENGLISH: 'text-violet-500',
      GAME: 'text-cyan-500',
      PROGRAMMING: 'text-red-500',
      NONE: 'text-yellow-300',
    };
    const upperType = type.toUpperCase() as TopicCategoryType;
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
