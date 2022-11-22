import { TopicCategoryEnum } from '@monorepo/multichoice/constant';
import React from 'react';
import { classNames } from '../../../helper/classNames';

type BadgeType = 'SUCCESS' | 'DANGER' | 'WARNING' | 'INFOR' | 'NORMAL';

interface IBadge {
  type?: `${TopicCategoryEnum}`;
  className?: string;
  title?: string;
}

const Badge: React.FC<IBadge> = ({
  type = 'PROGRAMMING',
  className = '',
  title = '',
}) => {
  const badgeColor = (type: `${TopicCategoryEnum}` = 'none'): string => {
    const colorTypes: Record<`${TopicCategoryEnum}`, string> = {
      business: 'text-green-500',
      english: 'text-violet-500',
      game: 'text-cyan-500',
      programming: 'text-red-500',
      none: 'text-yellow-300',
    };
    return colorTypes[type] || '';
  };

  return (
    <div
      className={classNames([
        'px-1.5 text-xs font-semibold capitalize',
        badgeColor(type as `${TopicCategoryEnum}`),
      ])}
    >
      <span>{title}</span>
    </div>
  );
};

export default Badge;
