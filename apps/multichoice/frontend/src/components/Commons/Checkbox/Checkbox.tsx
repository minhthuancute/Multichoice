import React, { useState } from 'react';
import { BsCheck } from 'react-icons/bs';
import { classNames } from '../../../helper/classNames';
import './checkbox.scss';

interface CheckboxProps {
  disable?: boolean;
  registerField?: any;
  id: string;
  className?: string;
  isChecked?: boolean;
  textLabel?: string;
  onChange?: (isChecked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  disable = false,
  registerField = null,
  id = '',
  className = '',
  isChecked = false,
  onChange,
  textLabel,
}) => {
  const [toggleChecked, setToggleChecked] = useState<boolean>(isChecked);

  const onChangeCheckbox = (): void => {
    setToggleChecked((state) => !state);
    if (onChange) {
      onChange(!toggleChecked);
    }
  };

  const onCLickLabel = (e: React.FormEvent<HTMLElement>): void => {
    if (disable) {
      e.preventDefault();
      return;
    }
  };

  return (
    <div
      className={classNames(['wrapper-input flex items-center', className], {
        'opacity-40': disable,
      })}
    >
      <input
        {...registerField}
        hidden
        defaultChecked={isChecked}
        type="checkbox"
        id={id}
        onChange={() => onChangeCheckbox()}
      />

      <label
        htmlFor={id}
        onClick={(e: React.FormEvent<HTMLElement>) => onCLickLabel(e)}
        className={classNames('flex items-center cursor-pointer text-sm', {
          'cursor-not-allowed': disable,
        })}
      >
        <div className="box mr-2 w-4 h-4 rounded-sm border border-solid border-slate-400">
          <BsCheck className="icon opacity-0 fill-white" />
        </div>
        <span
          dangerouslySetInnerHTML={{
            __html: textLabel ? textLabel : '',
          }}
        ></span>
      </label>
    </div>
  );
};

export default React.memo(Checkbox);
