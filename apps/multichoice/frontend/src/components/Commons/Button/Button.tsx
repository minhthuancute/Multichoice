import React, { ButtonHTMLAttributes } from 'react';
import { classNames } from '../../../helper/classNames';

type ButtonColors = 'success' | 'danger' | 'warning' | 'default' | 'infor';
interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  dissable?: boolean;
  fullWidth?: boolean;
  color?: ButtonColors;
  children?: React.ReactNode;
}

const Button: React.FC<IButtonProps> = ({
  dissable = false,
  fullWidth = false,
  children,
  ...rest
}) => {
  const defaultCss = 'py-3 bg-primary-900 rounded-md text-white font-medium';

  // const buttonColors: Record<ButtonColors, string> = {
  //   default: `

  //   `

  // }
  // const buttonColor = (color: ButtonColors) => {

  // }
  return (
    <button
      {...rest}
      className={classNames(
        [
          defaultCss,
          `

        `,
        ],
        {
          'w-full': fullWidth,
          'w-max': !fullWidth,
          'opacity-50 pointer-events-none': dissable,
        }
      )}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
