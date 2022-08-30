export const copyClipboard = (textCopy = '') => {
  navigator.clipboard.writeText(textCopy);
};
