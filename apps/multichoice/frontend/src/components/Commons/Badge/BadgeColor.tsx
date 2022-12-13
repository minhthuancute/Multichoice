import React from 'react';
import { classNames } from '../../../helper/classNames';

type BadgeType =
  | 'default'
  | 'dark'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

interface IBadge {
  text: string;
  type?: BadgeType;
}

const BadgeColor: React.FC<IBadge> = ({ text = 'badge', type = 'default' }) => {
  const badgeColor = (type: `${BadgeType}` = 'default'): string => {
    const colorTypes: Record<`${BadgeType}`, string> = {
      default: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800',
      dark: 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-800',
      red: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-800',
      green:
        'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-800',
      yellow:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-800',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800',
      indigo:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-800',
      purple:
        'bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-800',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-200 dark:text-pink-800',
    };
    return colorTypes[type] || '';
  };

  return (
    <span
      className={classNames([
        'text-xs font-semibold px-2 py-0.5 rounded',
        badgeColor(type),
      ])}
    >
      {text}
    </span>
  );
};

export default BadgeColor;
