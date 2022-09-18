export const getDate = (date: string | number): string => {
  const d = new Date(date);
  const result = d.toLocaleDateString('en-US');
  return result;
};

export const getTime = (date: string | number): string => {
  const d = new Date(date);
  const result = d.toLocaleTimeString('en-US');
  return result;
};

export const getDistance = (
  startDate: string | number,
  endDate: string | number
): string => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const distance = end - start;
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return `${hours}/${minutes}/${seconds}`;
};
