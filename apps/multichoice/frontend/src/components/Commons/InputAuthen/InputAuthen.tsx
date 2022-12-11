import React, {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  useState,
} from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { IconType } from 'react-icons/lib';
import { classNames } from '../../../helper/classNames';

export interface IInputAuthen extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  Icon?: IconType;
  isError?: boolean;
  errMessage?: string;
  fieldName?: string;
  registerField?: UseFormRegisterReturn;
  type: HTMLInputTypeAttribute;
}

const InputAuthen: React.FC<IInputAuthen> = ({
  className,
  registerField = null,
  isError = false,
  errMessage = '',
  Icon = '',
  type = 'text',
  ...rest
}) => {
  const [isHidePass, setIsHidePass] = useState<boolean>(true);

  const getTypeInput = (): HTMLInputTypeAttribute => {
    if (type !== 'password') {
      return type;
    } else {
      return isHidePass ? 'password' : 'text';
    }
  };

  return (
    <div className={classNames('form-group relative w-full', className)}>
      <div
        className={classNames('relative wrapper-input', {
          'no-error': !isError,
        })}
      >
        <input
          {...registerField}
          {...rest}
          type={getTypeInput()}
          className={classNames(
            `transition-all duration-200 w-full outline-none border px-4 py-2 border-solid
            rounded-md text-sm placeholder:text-xs hover:border-primary-900`,
            {
              'border-stone-200 focus:border-primary-900 placeholder:text-slate-400':
                !isError,
              'border-red-500 focus:border-red-500 text-red-500 placeholder:text-red-500':
                isError,
              'text-slate-800': !isError,
              'pl-10': Icon,
              'pl-3': !Icon,
            }
          )}
        />
        <label
          htmlFor="password"
          className="absolute inline-block pl-3 left-0 top-1/2 transform -translate-y-1/2"
        >
          {Icon && (
            <Icon
              className={classNames('transition-all duration-200 text-xl', {
                'fill-slate-400': !isError,
                'fill-red-500': isError,
              })}
            />
          )}
        </label>

        {type === 'password' && (
          <div
            className="absolute flex px-2 right-2 top-1/2 transform -translate-y-1/2
           items-center"
          >
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
      </div>

      {isError && (
        <p className="mt-1 text-xs text-red-500 first-letter:capitalize">
          {errMessage}
        </p>
      )}
    </div>
  );
};

export default React.memo(InputAuthen);
