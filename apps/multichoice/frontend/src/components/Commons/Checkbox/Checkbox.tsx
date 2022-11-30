import React, { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { BsCheck } from 'react-icons/bs';
import { classNames } from '../../../helper/classNames';
import PolaCode from '../PolaCode/PolaCode';
import './checkbox.scss';

interface CheckboxProps {
  disable?: boolean;
  registerField?: UseFormRegisterReturn;
  id: string;
  className?: string;
  isChecked?: boolean;
  textLabel?: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  disable = false,
  registerField = null,
  id = '',
  className = '',
  isChecked = false,
  onChange,
  textLabel = '',
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
    } else {
      onChangeCheckbox();
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
      />

      <label
        htmlFor={id}
        onClick={(e: React.FormEvent<HTMLElement>) => onCLickLabel(e)}
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
