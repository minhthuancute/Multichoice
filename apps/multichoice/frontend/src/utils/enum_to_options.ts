import { IOption } from '../components/Commons/Select/Select';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const enumToOptions = (Enum: any) => {
  const typesResult = [];
  for (const item in Enum) {
    const enumValue = item;
    typesResult.push(enumValue);
  }
  const options: IOption[] = typesResult.map((timeTypes) => ({
    label: timeTypes,
    value: timeTypes,
  })) as IOption[];
  return options;
};
