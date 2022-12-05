import React, { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { BsCheck } from 'react-icons/bs';
import { classNames } from '../../../helper/classNames';
import PolaCode from '../PolaCode/PolaCode';
import './checkbox.scss';

interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  disable?: boolean;
  registerField?: UseFormRegisterReturn;
  className?: string;
  textLabel?: string;
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
      <input {...rest} {...registerField} hidden />

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
        <div className="box mr-2 w-4 h-4 rounded-sm border border-solid border-slate-400">
          <BsCheck className="icon opacity-0 fill-white" />
        </div>
        <PolaCode content={textLabel} className="text-slate-800 text-sm" />
      </label>
    </div>
  );
};

export default React.memo(Checkbox);
