import { FilterType, FilterEnum } from '../types';
import { FC } from 'react';
import { FilterBadge } from './FilterBadge';

interface Props {
  filters: FilterType<FilterEnum>[];
}
export const FilterList: FC<Props> = ({ filters }) => {
  return (
    <>
      {filters.map((filter) => {
        return <FilterBadge key={filter.key} filter={filter} />;
      })}
    </>
  );
};
