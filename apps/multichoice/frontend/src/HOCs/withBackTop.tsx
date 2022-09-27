import React, { ComponentType } from 'react';
import { BsArrowUp } from 'react-icons/bs';

export function withBackTop<T>(Component: ComponentType<T & any>) {
  const NewComponent = (props: T) => {
    const handleBackToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    return (
      <>
        <Component {...props} />
        <div>
          <button
            onClick={handleBackToTop}
            className="fixed bottom-5 right-5 z-50 bg-primary-800 w-10 h-10
            flex items-center justify-center rounded-md text-white font-bold
            transform transition-all duration-200 hover:-translate-y-2"
          >
            <BsArrowUp />
          </button>
        </div>
      </>
    );
  };
  return NewComponent;
}
