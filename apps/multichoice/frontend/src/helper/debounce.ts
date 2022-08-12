type FunctionDebounce = (args: any) => any;

export const debounce = (fn: FunctionDebounce, delay = 200) => {
  let timer: ReturnType<typeof setTimeout>;
  return (args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, args);
    }, delay);
  };
};
