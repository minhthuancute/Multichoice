import React, { HTMLInputTypeAttribute } from 'react';
import { classNames } from '../../../helper/classNames';

export interface ITextAreaProps {
  onChange?: (value: string) => void;
  textLabel?: React.ReactNode;
  defaultValue?: any;
  className?: string;
  classNameTextarea?: string;
  id?: string;
  placeholder?: string;
  Icon?: React.ReactNode;
  typeInput?: HTMLInputTypeAttribute;
  isError?: boolean;
  errMessage?: string;
  fieldName?: string;
  registerField?: any;
  isRequired?: boolean;
}

const TextArea: React.FC<ITextAreaProps> = ({
  onChange,
  textLabel = '',
  defaultValue = '',
  className,
  classNameTextarea = '',
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
        className={classNames('relative wrapper-input h-full', {
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

        <textarea
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
          {...registerField}
          defaultValue={defaultValue}
          id={id}
          type={typeInput}
          placeholder={placeholder}
          className={classNames(
            [
              `text-sm w-full text-stone-600 outline-none
            border py-2 border-solid border-stone-200 focus:border-primary-900
            rounded-md placeholder:text-sm`,
              classNameTextarea,
            ],
            {
              'border-stone-200 focus:border-primary-900': !isError,
              'border-red-500 focus:border-red-500': isError,
              'pl-9': Icon,
              'px-4': !Icon,
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

export default React.memo(TextArea);
