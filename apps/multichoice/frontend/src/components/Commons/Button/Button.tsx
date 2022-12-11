import React, { ButtonHTMLAttributes } from 'react';
import { classNames } from '../../../helper/classNames';
import './button.scss';

type ButtonColors = 'success' | 'danger' | 'warning' | 'default' | 'infor';
type ButtonSize = 'sm' | 'md' | 'lg';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  widthFull?: boolean;
  color?: ButtonColors;
  size?: ButtonSize;
  children?: React.ReactNode;
}

const Button: React.FC<IButtonProps> = ({
  widthFull = false,
  color = 'default',
  size = 'md',
  children,
  ...rest
}) => {
  const defaultCss = `rounded-md text-sm py-2 px-3 border border-solid font-bold`;

  const buttonColor = (color: ButtonColors = 'default'): string => {
    switch (color) {
      case 'default':
        return `btn-default bg-slate-800 text-white`;
      case 'success':
        return 'btn-success text-white border-primary-800 bg-primary-800';
      case 'danger':
        return 'btn-danger bg-red-500 text-white border-red500';
      default:
        return '';
    }
  };

  const buttonSize = (size: ButtonSize = 'md'): string => {
    switch (size) {
      case 'sm':
        return `py-1`;
      case 'md':
        return 'py-2';
      case 'lg':
        return 'py-2.5';
      default:
        return '';
    }
  };

  return (
    <button
      {...rest}
      onClick={(e) => {
        if (rest.disabled) {
          e.preventDefault();
        } else {
          rest.onClick && rest.onClick(e);
        }
      }}
      className={classNames(
        [
          defaultCss,
          buttonColor(color),
          buttonSize(size),
          rest.className as string,
        ],

        {
          'w-full': widthFull,
          'min-w-[128px]': !widthFull,
          'opacity-50 cursor-not-allowed': rest.disabled,
        }
      )}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
