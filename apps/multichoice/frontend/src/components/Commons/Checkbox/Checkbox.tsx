import React, { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { BsCheck } from 'react-icons/bs';
import { classNames } from '../../../helper/classNames';
import './checkbox.scss';

interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  disable?: boolean;
  registerField?: UseFormRegisterReturn;
  className?: string;
  textLabel?: React.ReactNode;
}

const Checkbox: React.FC<ICheckboxProps> = ({
  disable = false,
  registerField = null,
  className = '',
  textLabel = '',
  ...rest
}) => {
  return (
    <div
      className={classNames(['wrapper-input flex items-center', className], {
        'opacity-40': disable,
      })}
    >
      <input
        {...rest}
        {...registerField}
        onChange={(e) => {
          registerField?.onChange(e);
        }}
        name={rest.name ? rest.name : registerField?.name}
        hidden
      />

      <label
        htmlFor={rest.id}
        onClick={(e: React.FormEvent<HTMLElement>) => {
          disable && e.preventDefault();
        }}
        className={classNames(
          'flex items-center cursor-pointer text-sm text-slate-800',
          {
            'cursor-not-allowed': disable,
          }
        )}
      >
        <div className="box mr-2 w-5 h-5 rounded-sm border border-solid border-slate-400">
          <BsCheck className="icon fill-white text-lg opacity-0" />
        </div>
        {textLabel}
      </label>
    </div>
  );
};

export default React.memo(Checkbox);
