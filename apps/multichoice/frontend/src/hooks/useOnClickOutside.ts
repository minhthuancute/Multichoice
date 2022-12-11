/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
// Hook
export const useOnClickOutside = (
  ref: any,
  handler: any,
  ...exclusiveRefs: any[]
) => {
  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      for (let i = 0; i < exclusiveRefs.length; i++) {
        const ref = exclusiveRefs[i];
        if (ref.current.contains(event.target)) {
          return;
        }
      }
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
