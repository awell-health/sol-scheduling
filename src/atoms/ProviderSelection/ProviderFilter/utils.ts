import { isEmpty } from 'lodash-es';
import { FilterEnum, FilterType } from '../types';

const getEnumKeyFromVal = (enumType: FilterEnum, value: string) => {
  return (
    Object.keys(enumType).find((key) => enumType[key] === value) ?? 'Unknown'
  ).replace('_', ' ');
};

export const displaySelectedValues = <T extends FilterEnum>(
  filter: FilterType<T>
) => {
  if (isEmpty(filter.selectedOptions)) {
    return '';
  }
  return filter.selectedOptions
    .map((val) => getEnumKeyFromVal(filter.enum, val))
    .join(', ');
};
