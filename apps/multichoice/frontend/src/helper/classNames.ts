interface IClassNames {
  (classes: string | string[], restClass?: object | string): string;
}

export const classNames: IClassNames = (classes, restClass): string => {
  if (!restClass) {
    if (typeof classes === 'object') {
      return classes.join(' ');
    } else {
      return classes;
    }
  }

  if (typeof restClass === 'string') {
    return classes + ' ' + restClass;
  }
  let classCondition = ' ';
  for (const [key, value] of Object.entries(restClass)) {
    classCondition += value ? `${key} ` : '';
  }
  if (typeof classes === 'object') {
    return classes.join(' ') + classCondition;
  } else {
    return classes + classCondition;
  }
};
