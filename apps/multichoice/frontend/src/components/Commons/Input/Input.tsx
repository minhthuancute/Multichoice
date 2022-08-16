import React, { HTMLInputTypeAttribute, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { classNames } from '../../../helper/classNames';

export interface IInput {
  defaultValue?: string;
  className?: string;
  id?: string;
  placeholder?: string;
  Icon?: any;
  typeInput?: HTMLInputTypeAttribute;
  isError?: boolean;
  errMessage?: string;
  fieldName?: string;
  registerField?: any;
}

const Input: React.FC<IInput> = ({
  defaultValue,
  className,
  id,
  registerField,
  isError,
  errMessage,
  Icon,
  placeholder,
  typeInput = 'text',
}) => {
  const [isHidePass, setIsHidePass] = useState<boolean>(true);

  const getTypeInput = (): HTMLInputTypeAttribute => {
    if (typeInput !== 'password') {
      return typeInput;
    } else {
      return isHidePass ? 'password' : 'text';
    }
  };

  return (
    <div className={classNames('form-group relative', className)}>
      {/* input content */}
      <div
        className={classNames('relative wrapper-input', {
          'no-error': !isError,
        })}
      >
        <input
          {...registerField}
          id={id}
          type={getTypeInput()}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={classNames(
            `transition-all duration-200 w-full text-stone-600 outline-none border px-2.5 py-4 border-solid
              border-stone-200 focus:border-primary-900 rounded-md`,
            {
              'border-stone-200 focus:border-primary-900': !isError,
              'border-red-500 focus:border-red-500': isError,
              'pl-9': Icon,
              'pl-2.5': !Icon,
            }
          )}
        />
        <label
          htmlFor="password"
          className="absolute inline-block px-2 left-0 top-1/2 transform -translate-y-1/2"
        >
          <Icon
            className={classNames('transition-all duration-200 text-xl', {
              'fill-slate-400': !isError,
              'fill-red-500': isError,
            })}
          />
        </label>

        {/* toggle password */}
        {typeInput === 'password' && (
          <div className="absolute inline-block px-2 right-2 top-1/2 transform -translate-y-1/2">
            <button type="button" onClick={() => setIsHidePass(!isHidePass)}>
              {isHidePass ? (
                <AiOutlineEye
                  className={classNames('transition-all duration-200 text-xl', {
                    'fill-slate-400': !isError,
                    'fill-red-500': isError,
                  })}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className={classNames('transition-all duration-200 text-xl', {
                    'fill-slate-400': !isError,
                    'fill-red-500': isError,
                  })}
                />
              )}
            </button>
          </div>
        )}
        {/* toggle password */}
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
