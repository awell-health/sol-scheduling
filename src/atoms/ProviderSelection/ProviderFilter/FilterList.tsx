import { FilterType, FilterEnum } from '../types';
import { FC } from 'react';
import { FilterBadge } from './FilterBadge';

interface Props {
  filters: FilterType<FilterEnum>[];
}

export const FilterList: FC<Props> = ({ filters }) => {
  const filterOrder = [
    'state',
    'facility',
    'therapeuticModality',
    'deliveryMethod',
    'timeOfTheDay',
    'gender',
    'clinicalFocus',
    'language',
    'insurance'
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
