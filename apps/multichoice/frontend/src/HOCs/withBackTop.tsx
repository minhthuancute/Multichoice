import React, { ComponentType, useEffect, useState } from 'react';
import { BsArrowUp } from 'react-icons/bs';
import { classNames } from '../helper/classNames';

export function withBackTop<T>(Component: ComponentType<T & any>) {
  const NewComponent = (props: T) => {
    const [scrollTop, setScrollTop] = useState<number>(0);

    const handleBackToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    useEffect(() => {
      const handleScroll = () => {
        setScrollTop(window.scrollY);
      };
      document.addEventListener('scroll', handleScroll);
      return () => {
        document.removeEventListener('scroll', handleScroll);
      };
    }, []);

    return (
      <>
        <Component {...props} />
        <div>
          <button
            onClick={handleBackToTop}
            className={classNames(
              `fixed bottom-5 right-5 z-50 bg-primary-800 w-10 h-10
              flex items-center justify-center rounded-md text-white font-bold
              transform transition-all duration-200 hover:-translate-y-1`,
              {
                'opacity-0': scrollTop <= 80,
                'opacity-1': scrollTop >= 80,
              }
            )}
          >
            <BsArrowUp />
          </button>
        </div>
      </>
    );
  };
  return NewComponent;
}
