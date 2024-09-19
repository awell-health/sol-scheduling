import { isEmpty } from 'lodash-es';
import { FilterEnum, FilterType } from '../types';

const getEnumKeyFromVal = (value: string) => {
  if (value === 'F') {
    return 'Female';
  }
  if (value === 'M') {
    return 'Male';
  } else {
    return value;
  }
};

export const displaySelectedValues = <T extends FilterEnum>(
  filter: FilterType<T>
) => {
  if (isEmpty(filter.selectedOptions)) {
    return '';
  }
  return filter.selectedOptions.map((val) => getEnumKeyFromVal(val)).join(', ');
};
