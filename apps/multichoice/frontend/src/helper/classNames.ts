interface IClassNames {
  (classes: string, restClass?: object): string;
}

export const classNames: IClassNames = (classes = '', restClass): string => {
  if (!restClass) return classes;
  let classCondition: string = ' ';
  for (const [key, value] of Object.entries(restClass)) {
    classCondition += value ? `${key} ` : '';
  }
  return classes + classCondition;
};
