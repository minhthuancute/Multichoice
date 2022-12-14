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
  const badgeColor = (
    type: `${TopicCategoryEnum}` = TopicCategoryEnum.NONE
  ): string => {
    const colorTypes: Record<`${TopicCategoryEnum}`, string> = {
      [TopicCategoryEnum.BUSINESS]: 'text-green-500',
      [TopicCategoryEnum.ENGLISH]: 'text-violet-500',
      [TopicCategoryEnum.GAME]: 'text-cyan-500',
      [TopicCategoryEnum.PROGRAMMING]: 'text-red-500',
      [TopicCategoryEnum.NONE]: 'text-yellow-300',
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
