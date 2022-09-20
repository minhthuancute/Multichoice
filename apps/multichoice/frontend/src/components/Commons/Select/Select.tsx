import React, { useRef, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { classNames } from '../../../helper/classNames';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';

export interface IOption {
  label: string;
  value: string;
}

export interface ISelect {
  onChange?: (value: IOption) => void;
  defaultValue?: string;
  className?: string;
  options?: IOption[];
  textLabel?: string;
  isRequired?: boolean;
}

const Select: React.FC<ISelect> = ({
  onChange,
  defaultValue = '',
  options,
  className = '',
  textLabel = '',
  isRequired = false,
}) => {
  const refSelect = useRef<HTMLDivElement>(null);

  const [collapseSelect, setCollapseSelect] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue);

  const onSelect = (option: IOption) => {
    setCollapseSelect(true);
    setSelectedOption(option.label);
    if (onChange) {
      onChange(option);
    }
  };

  const onClickOutSide = () => {
    setCollapseSelect(true);
  };

  useOnClickOutside(refSelect, onClickOutSide);

  return (
    <div className={classNames(['wrapper-select', className])}>
      <label className="font-semibold text-slate-800 text-sm inline-block mb-2">
        {textLabel}
        {isRequired ? <span className="ml-1 text-red-600">*</span> : null}
      </label>
      <div className="select-body relative" ref={refSelect}>
        <div className="selected-item ">
          <button
            onClick={() => setCollapseSelect(!collapseSelect)}
            type="button"
            className="flex items-center justify-between capitalize text-sm transition-all duration-200 w-full
             text-stone-600 outline-none border px-2.5 py-2 border-solid border-stone-200
             focus:border-primary-900 rounded-md"
          >
            {selectedOption ? selectedOption : defaultValue}
            <BiChevronDown
              className={classNames(
                'icon transform transition-all duration-200',
                {
                  'rotate-180 fill-primary-900': !collapseSelect,
                }
              )}
            />
          </button>
        </div>
        <ul
          className={classNames(
            `wrapper-options overflow-hidden w-full bg-white mt-2  border border-solid border-primary-900
            rounded-md absolute z-40 top-full transform origin-top transition-all duration-300`,
            {
              'scale-y-0': collapseSelect,
            }
          )}
        >
          {options &&
            options.map((option: IOption, index: number) => (
              <li
                key={option.value + index}
                onClick={() => onSelect(option)}
                className={classNames(
                  `capitalize cursor-pointer text-sm text-slate-800 py-2 px-4 last:mb-0
                    transition-all duration-200 hover:bg-slate-100 rounded-md
                  `,
                  {
                    'bg-slate-100 text-primary-900':
                      option.value === selectedOption,
                  }
                )}
              >
                {option.value}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(Select);
