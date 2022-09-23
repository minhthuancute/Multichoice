export const hasContentEditor = (content: string): boolean => {
  const regex = /(<([^>]+)>)/gi;
  const regexImg = /src=./gi;
  const hasText = !!content.replace(regex, '').length;
  const hasImg = regexImg.test(content);
  return hasText || hasImg;
};
