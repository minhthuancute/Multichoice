export const generateArray = (length = 0) => {
  const result = Array.from({ length }, (_, i) => i);
  return result;
};
