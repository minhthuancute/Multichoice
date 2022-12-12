import React, { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { classNames } from '../../../helper/classNames';
import './switch.scss';

interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  disable?: boolean;
  registerField?: UseFormRegisterReturn;
  className?: string;
  textLabel?: React.ReactNode;
}

const Switch: React.FC<ICheckboxProps> = ({
  disable = false,
  registerField = null,
  className = '',
  textLabel = '',
  ...rest
}) => {
  return (
    <div
      className={classNames(['wrapper-switch', className], {
        'opacity-40': disable,
      })}
    >
      <input
        {...rest}
        {...registerField}
        name={rest.name ? rest.name : registerField?.name}
        type={rest.type || 'checkbox'}
        id={rest.id || 'checkbox'}
        hidden
      />
      <label
        htmlFor={rest.id || 'checkbox'}
        onClick={(e: React.FormEvent<HTMLElement>) => {
          disable && e.preventDefault();
        }}
        className={classNames(
          `flex items-center cursor-pointer text-sm text-slate-800 w-10 h-5 rounded-2xl`,
          {
            'cursor-not-allowed': disable,
          }
        )}
      ></label>
    </div>
  );
};

export default React.memo(Switch);
