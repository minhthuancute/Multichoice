export const debounce = (fn: Function, delay: number = 200) => {
  let timer: ReturnType<typeof setTimeout>;
  return (args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, args);
    }, delay);
  };
};
