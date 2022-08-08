interface IClassNames {
  (classes: string, restClass?: object | string): string;
}

export const classNames: IClassNames = (classes = '', restClass): string => {
  if (!restClass) return classes;
  if (typeof restClass === 'string') {
    return classes + ' ' + restClass;
  }
  let classCondition = ' ';
  for (const [key, value] of Object.entries(restClass)) {
    classCondition += value ? `${key} ` : '';
  }
  return classes + classCondition;
};
