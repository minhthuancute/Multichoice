export const emptyContentEditor = (content: string): boolean => {
  const regex = /(<([^>]+)>)/gi;
  const hasText = !!content.replace(regex, '').length;
  return hasText;
};
