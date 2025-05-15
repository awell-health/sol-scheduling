import { FilterType, FilterEnum } from '../types';
import { FC } from 'react';
import { FilterBadge } from './FilterBadge';

interface Props {
  filters: FilterType<FilterEnum>[];
}

export const FilterList: FC<Props> = ({ filters }) => {
  const filterOrder = [
    'deliveryMethod',
    'state',
    'facility',
    'clinicalFocus',
    'gender',
    'ethnicity'
  ];
  // Sort the filters array based on the desired order
  filters.sort((a, b) => {
    return filterOrder.indexOf(a.key) - filterOrder.indexOf(b.key);
  });

  return (
    <>
      {filters.map((filter) => {
        return <FilterBadge key={filter.key} filter={filter} />;
      })}
    </>
  );
};
