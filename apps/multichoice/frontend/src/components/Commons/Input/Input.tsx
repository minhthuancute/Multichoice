import React, { HTMLInputTypeAttribute } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { classNames } from '../../../helper/classNames';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IInput {
  onChange?: (value: string) => void;
  textLabel?: React.ReactNode;
  defaultValue?: any;
  className?: string;
  classInput?: string;
  id?: string;
  placeholder?: string;
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

const Input: React.FC<IInput> = ({
  onChange,
  textLabel = '',
  defaultValue = '',
  className = '',
  classInput = '',
  id = '',
  registerField = null,
  isError = false,
  errMessage = '',
  Icon = '',
  placeholder = '',
  typeInput = 'text',
  isRequired = false,
  isDisable = false,
  inputSize = 'sm',
  hasBorder = true,
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
          htmlFor={id}
          className="font-semibold text-slate-800 text-sm inline-block mb-2"
        >
          {textLabel}
          {isRequired ? <span className="ml-1 text-red-600">*</span> : null}
        </label>
        <input
          {...registerField}
          // onChange={(e) => onChangeInput(e.target.value)}
          id={id}
          type={typeInput}
          placeholder={placeholder}
          defaultValue={defaultValue}
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
