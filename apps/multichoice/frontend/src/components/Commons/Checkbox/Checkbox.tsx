import React from 'react';
import { BsCheck } from 'react-icons/bs';
import './checkbox.scss';

interface CheckboxProps {
  textLabel?: string;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ onChange, textLabel }) => {
  return (
    <div className="wrapper-input flex items-center">
      <input hidden type="checkbox" id="remember" onChange={() => onChange()} />

      <label
        htmlFor="remember"
        className="flex items-center cursor-pointer text-sm"
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
