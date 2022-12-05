export const validObject = (object = {}): boolean => {
  return object && Object.keys(object).length > 0;
};
