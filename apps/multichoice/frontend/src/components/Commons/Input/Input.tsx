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
        {textLabel && (
          <label
            htmlFor={rest.id}
            className="font-semibold text-slate-800 text-sm inline-block mb-2"
          >
            {textLabel}
            {isRequired ? <span className="ml-1 text-red-600">*</span> : null}
          </label>
        )}

        <input
          {...registerField}
          {...rest}
          type={typeInput}
          className={classNames(
            `transition-all duration-200 w-full outline-none px-4 py-2 border-solid
            rounded-md text-sm placeholder:text-xs hover:border-primary-900`,
            {
              'border border-stone-200 focus:border-primary-900 placeholder:text-slate-400':
                !isError && hasBorder,
              'border border-red-500 focus:border-red-500 text-red-500 placeholder:text-red-500':
                isError,
              'text-slate-800': !isError,
              'pl-10': Icon,
              'pl-3': !Icon,
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
