export const minutesToSeconds = (minutes = 0): number => {
  const parseToSeconds = minutes * (60 * 1000);
  return parseToSeconds;
};

export const secondsToMinutes = (seconds = 0): number => {
  const parseToMinutes = seconds / (60 * 1000);
  return parseToMinutes;
};
