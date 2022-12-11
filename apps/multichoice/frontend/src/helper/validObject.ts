export const validObject = (object = {}): boolean => {
  return Boolean(object && Object.keys(object).length);
};
