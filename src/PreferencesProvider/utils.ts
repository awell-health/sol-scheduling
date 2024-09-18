import {
  ClinicalFocus,
  Ethnicity,
  Gender,
  DeliveryMethod,
  GetProvidersInputType,
  GetProvidersInputSchema
} from '../lib/api';
import {
  FilterEnum,
  FilterType,
  isFilterType,
  optionsFromEnum,
  optionsFromGenderEnum
} from '../atoms/ProviderSelection/types';

const updatePreferencesWithFilters = (
  prefs: GetProvidersInputType,
  filters: FilterType<FilterEnum>[]
): GetProvidersInputType => {
  filters.forEach((filter) => {
    switch (filter.key) {
      case 'age':
      case 'therapeuticModality':
      case 'language':
      case 'location': {
        return;
      }
      case 'gender': {
        prefs.gender = filter.selectedOptions[0] as Gender;
        break;
      }
      case 'ethnicity': {
        prefs.ethnicity = filter.selectedOptions[0] as Ethnicity;
        break;
      }
      case 'clinicalFocus': {
        prefs.clinicalFocus = filter.selectedOptions as ClinicalFocus[];
        break;
      }
      case 'deliveryMethod': {
        prefs.deliveryMethod = filter.selectedOptions[0] as DeliveryMethod;
      }
    }
  });
  const parsed = GetProvidersInputSchema.safeParse(prefs);
  if (!parsed.success) {
    console.error('Error updating preferences with filters', {
      parsed,
      prefs,
      filters
    });
    return prefs;
  }
  return parsed.data;
};

const preferencesToFiltersArray = (
  preferences: GetProvidersInputType
): FilterType<FilterEnum>[] => {
  return Object.keys(GetProvidersInputSchema.shape)
    .map((key) => {
      switch (key) {
        case 'age': {
          return undefined;
        }
        case 'gender': {
          return {
            key: 'gender',
            label: 'Gender',
            selectType: 'single',
            enum: Gender,
            options: optionsFromGenderEnum(),
            selectedOptions: preferences[key] ? [preferences[key]] : []
          };
        }
        case 'ethnicity': {
          return {
            key: 'ethnicity',
            label: 'Ethnicity',
            selectType: 'single',
            enum: Ethnicity,
            options: optionsFromEnum(Ethnicity),
            selectedOptions: preferences[key] ? [preferences[key]] : []
          };
        }
        case 'language': {
          return undefined;
        }
        case 'clinicalFocus': {
          return {
            key: 'clinicalFocus',
            label: 'Clinical Focus',
            selectType: 'multi',
            enum: ClinicalFocus,
            options: optionsFromEnum(ClinicalFocus),
            selectedOptions: preferences[key] ? preferences[key] : []
          };
        }
        // case 'therapeuticModality': {
        //   return {
        //     key: 'therapeuticModality',
        //     label: 'Therapeutic Modality',
        //     enum: Modality,
        //     options: optionsFromEnum(Modality),
        //     selectedOptions: []
        //   };
        // }
        case 'deliveryMethod': {
          return {
            key: 'deliveryMethod',
            label: 'Delivery Method',
            selectType: 'single',
            enum: DeliveryMethod,
            options: optionsFromEnum(DeliveryMethod),
            selectedOptions: []
          };
        }
        case 'location': {
          return undefined;
        }
        default: {
          return undefined;
        }
      }
    })
    .filter((f) => isFilterType(f));
};

// const filtersReversed: Partial<Record<keyof GetProvidersInputType, string>> =
//   Object.fromEntries(Object.entries(filters).map(([key, val]) => [val, key]));
export { updatePreferencesWithFilters, preferencesToFiltersArray };
