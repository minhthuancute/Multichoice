export const getDate = (date: string): string => {
  const d = new Date(date);
  const result = d.toLocaleDateString('en-US');
  return result;
};
