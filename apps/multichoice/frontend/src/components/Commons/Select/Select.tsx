import React, { useRef, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { classNames } from '../../../helper/classNames';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';

type PlacementOptions = 'LEFT' | 'RIGHT';
// type SizeOptions = 'NORMAL' | 'MD' | ;

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
  placementOptions?: PlacementOptions;
}

const Select: React.FC<ISelect> = ({
  onChange,
  defaultValue = '',
  options,
  className = '',
  textLabel = '',
  isRequired = false,
  placementOptions = 'LEFT',
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
      {textLabel && (
        <label className="text-slate-800 inline-block mb-2 font-semibold text-sm">
          {textLabel}
          {isRequired ? <span className="ml-1 text-red-600">*</span> : null}
        </label>
      )}
      <div className="select-body relative" ref={refSelect}>
        <div className="selected-item">
          <button
            onClick={() => setCollapseSelect(!collapseSelect)}
            type="button"
            className="flex items-center justify-between capitalizetransition-all duration-200 w-full
            text-slate-800 outline-none border px-4 py-2 border-solid border-stone-200
             focus:border-primary-900 rounded-md text-sm capitalize"
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
            `wrapper-options overflow-hidden max-w-lg min-w-max w-full bg-white mt-2 border border-solid border-primary-900
            rounded-md absolute z-40 top-full transform origin-top transition-all duration-300`,
            {
              'scale-y-0': collapseSelect,
              'left-0': placementOptions === 'LEFT',
              'right-0': placementOptions === 'RIGHT',
            }
          )}
        >
          {options &&
            options.map((option: IOption, index: number) => (
              <li
                key={option.value + index}
                onClick={() => onSelect(option)}
                className={classNames(
                  `cursor-pointer text-sm text-slate-800 py-2 px-4 last:mb-0
                   capitalize transition-all duration-200 hover:bg-slate-100 rounded-md
                  `,
                  {
                    'bg-slate-100 text-primary-900':
                      option.value.toLowerCase() ===
                      selectedOption.toLowerCase(),
                  }
                )}
              >
                {option.label}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(Select);
