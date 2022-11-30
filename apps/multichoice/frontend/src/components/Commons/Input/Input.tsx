import React, { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { classNames } from '../../../helper/classNames';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  textLabel?: React.ReactNode;
  className?: string;
  classInput?: string;
  Icon?: React.ReactNode;
  typeInput?: HTMLInputTypeAttribute;
  isError?: boolean;
  errMessage?: string;
  registerField?: UseFormRegisterReturn;
  isRequired?: boolean;
  isDisable?: boolean;
  inputSize?: InputSize;
  hasBorder?: boolean;
}

const Input: React.FC<IInputProps> = ({
  textLabel = '',
  registerField = null,
  isError = false,
  errMessage = '',
  Icon = '',
  className = '',
  typeInput = 'text',
  isRequired = false,
  inputSize = 'sm',
  hasBorder = true,
  ...rest
}) => {
  return (
    <div className={classNames(['form-group relative', className])}>
      {/* input content */}
      <div
        className={classNames('relative wrapper-input', {
          'no-error': !isError,
        })}
      >
        <label
          htmlFor={rest.id}
          className="font-semibold text-slate-800 text-sm inline-block mb-2"
        >
          {textLabel}
          {isRequired ? <span className="ml-1 text-red-600">*</span> : null}
        </label>
        <input
          {...registerField}
          {...rest}
          type={typeInput}
          className={classNames(
            [
              `text-sm transition-all duration-200 w-full text-stone-600 outline-none
             px-4
            rounded-md placeholder:text-sm`,
            ],
            {
              'border-stone-200 focus:border-primary-900': !isError,
              'border-red-500 focus:border-red-500': isError,
              'pl-9': Icon,
              'pl-4': !Icon,
              'py-2': inputSize === 'sm',
              'py-3': inputSize === 'md',
              'py-4': inputSize === 'lg',
              'border border-solid border-stone-200 focus:border-primary-900 rounded-md':
                hasBorder,
            }
          )}
        />
      </div>

      {/* show error */}
      {isError && (
        <p className="mt-1 text-xs text-red-500 first-letter:capitalize">
          {errMessage}
        </p>
      )}
    </div>
  );
};

export default React.memo(Input);
