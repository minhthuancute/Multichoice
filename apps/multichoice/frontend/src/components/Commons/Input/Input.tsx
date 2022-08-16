import React, { HTMLInputTypeAttribute } from 'react';
import { classNames } from '../../../helper/classNames';

export interface IInput {
  textLabel?: React.ReactNode;
  defaultValue?: any;
  className?: string;
  id?: string;
  placeholder?: string;
  Icon?: any;
  typeInput?: HTMLInputTypeAttribute;
  isError?: boolean;
  errMessage?: string;
  fieldName?: string;
  registerField?: any;
  isRequired?: boolean;
}

const InputCommon: React.FC<IInput> = ({
  textLabel = '',
  defaultValue = '',
  className,
  id = '',
  registerField = null,
  isError = false,
  errMessage = '',
  Icon = '',
  placeholder = '',
  typeInput = 'text',
  isRequired = false,
}) => {
  return (
    <div className={classNames('form-group relative', className)}>
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
          id={id}
          type={typeInput}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={classNames(
            `text-sm transition-all duration-200 w-full text-stone-600 outline-none 
            border px-2.5 py-2 border-solid border-stone-200 focus:border-primary-900
            rounded-md placeholder:text-sm`,
            {
              'border-stone-200 focus:border-primary-900': !isError,
              'border-red-500 focus:border-red-500': isError,
              'pl-9': Icon,
              'pl-2.5': !Icon,
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

export default React.memo(InputCommon);
