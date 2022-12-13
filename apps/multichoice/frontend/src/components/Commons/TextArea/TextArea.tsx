/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { TextareaHTMLAttributes, useEffect, useId } from 'react';
import { classNames } from '../../../helper/classNames';
import TextareaAutosize from 'react-textarea-autosize';

export interface ITextAreaProps
  extends TextareaHTMLAttributes<HTMLAreaElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textLabel?: React.ReactNode;
  Icon?: React.ReactNode;
  isError?: boolean;
  errMessage?: string;
  registerField?: any;
  isRequired?: boolean;
  areaClassname?: string;
}

const TextArea: React.FC<ITextAreaProps> = ({
  textLabel = '',
  registerField = null,
  isError = false,
  errMessage = '',
  Icon = '',
  isRequired = false,
  ...rest
}) => {
  const uniqueId = useId().slice(1, 3);

  useEffect(() => {
    const textareaElement = document.querySelector(
      '.area-resize-' + uniqueId
    ) as HTMLHtmlElement;
    if (textareaElement) {
      textareaElement.style.height = (rest.style?.height as string) || '';
    }
  }, []);

  return (
    <div
      className={classNames(['form-group w-full', rest.className as string])}
    >
      <div>
        <label
          htmlFor={rest.id}
          className="font-semibold text-slate-800 text-sm inline-block mb-2"
        >
          {textLabel}
          {isRequired ? <span className="ml-1 text-red-600">*</span> : null}
        </label>

        <TextareaAutosize
          {...registerField}
          {...rest}
          className={classNames(
            [
              `text-sm w-full text-stone-600 outline-none
              border py-2 border-solid border-stone-200 focus:border-primary-900
              rounded-md placeholder:text-sm resize-none hover:border-primary-900`,
              'area-resize-' + uniqueId,
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

      {isError && (
        <p className="mt-1 text-xs text-red-500 first-letter:capitalize">
          {errMessage}
        </p>
      )}
    </div>
  );
};

export default React.memo(TextArea);
