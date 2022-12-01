export const validArray = <T>(array?: Array<T>): boolean => {
  return Boolean(array && Array.isArray(array) && array.length > 0);
};
