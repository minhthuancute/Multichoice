import React from 'react';
import './checkbox.scss';

interface ICheckbox {
  textLabel?: string;
  onChange: () => void;
}

const Checkbox: React.FC<ICheckbox> = ({ onChange, textLabel }) => {
  return (
    <div className="wrapper-input flex items-center">
      <input hidden type="checkbox" id="remember" onChange={() => onChange()} />

      <label
        htmlFor="remember"
        className="flex items-center cursor-pointer text-sm"
      >
        <div className="box mr-2 w-4 h-4 rounded-sm border border-solid border-slate-400"></div>
        {textLabel}
      </label>
    </div>
  );
};

export default Checkbox;
