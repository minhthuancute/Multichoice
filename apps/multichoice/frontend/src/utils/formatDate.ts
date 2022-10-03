export const getDate = (date: string | number): string => {
  const d = new Date(date);
  const result = d.toLocaleDateString('en-GB', { hour12: false });
  return result;
};

export const getTime = (date: string | number): string => {
  const d = new Date(date);
  const result = d.toLocaleTimeString('vn');
  return result;
};

export const getDistance = (
  startDate: string | number,
  endDate: string | number
): string => {
  const date1 = new Date(startDate).getTime();
  const date2 = new Date(endDate).getTime();
  let distance = Math.abs(date1 - date2);
  const hours = Math.floor(distance / 3600000);
  distance -= hours * 3600000;
  const minutes = Math.floor(distance / 60000);
  distance -= minutes * 60000;
  const seconds = Math.floor(distance / 1000);
  return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
};
