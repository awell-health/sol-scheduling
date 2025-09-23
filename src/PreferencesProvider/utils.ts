import {
  ClinicalFocus,
  Ethnicity,
  Gender,
  DeliveryMethod,
  GetProvidersInputType,
  GetProvidersInputSchema,
  LocationState,
  LocationFacility,
  TimeOfTheDay,
  Modality,
  Language,
  Insurance
} from '../lib/api';
import {
  FilterEnum,
  FilterType,
  isFilterType,
  optionsFromEnum,
  optionsForGender,
  optionsForState,
  optionsForFacility
} from '../atoms/ProviderSelection';

const updatePreferencesWithFilters = (
  prefs: GetProvidersInputType,
  filters: FilterType<FilterEnum>[]
): GetProvidersInputType => {
  filters.forEach((filter) => {
    switch (filter.key) {
      case 'age':
        return;
      case 'language': {
        prefs.language = filter.selectedOptions[0] as Language;
        break;
      }
      case 'insurance': {
        prefs.insurance = filter.selectedOptions[0] as Insurance;
        break;
      }
      case 'therapeuticModality': {
        const selectedModality = filter.selectedOptions[0] as Modality;
        if (selectedModality === Modality.Therapy) {
          prefs.therapeuticModality = 'Therapy';
        } else if (selectedModality) {
          prefs.therapeuticModality = 'Psychiatric';
        }
        break;
      }
      case 'timeOfTheDay': {
        prefs.timeOfTheDay = filter.selectedOptions[0] as TimeOfTheDay;
        break;
      }
      case 'state': {
        if (!prefs.location) {
          prefs.location = {
            state: undefined,
            facility: undefined
          };
        }
        prefs.location.state = filter.selectedOptions[0] as LocationState;
        break;
      }
      case 'facility': {
        if (!prefs.location) {
          prefs.location = {
            state: undefined,
            facility: undefined
          };
        }
        prefs.location.facility = filter.selectedOptions[0] as LocationFacility;
        break;
      }
      case 'location': {
        // really ugly code to handle the fact that the location filter is a compound filter
        if (prefs.location) {
          if (filter.selectedOptions.length > 0) {
            if (filter.selectedOptions[0].length === 2) {
              prefs.location.state = filter.selectedOptions[0] as LocationState;
              prefs.location.facility = undefined;
            } else {
              prefs.location.state = undefined;
              prefs.location.facility = filter
                .selectedOptions[0] as LocationFacility;
            }
          } else {
            // this is needed to clear the location filter
            prefs.location.state = undefined;
            prefs.location.facility = undefined;
          }
        }
        break;
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
            options: optionsForGender(),
            selectedOptions: preferences[key] ? [preferences[key]] : []
          };
        }
        case 'ethnicity': {
          return undefined;
        }
        case 'language': {
          return {
            key: 'language',
            label: 'Language',
            selectType: 'single',
            enum: Language,
            options: optionsFromEnum(Language),
            selectedOptions: preferences[key] ? [preferences[key]] : []
          };
        }
        case 'insurance': {
          return {
            key: 'insurance',
            label: 'Insurance',
            selectType: 'single',
            enum: Insurance,
            options: optionsFromEnum(Insurance),
            selectedOptions: preferences[key] ? [preferences[key]] : []
          };
        }
        case 'therapeuticModality': {
          return {
            key: 'therapeuticModality',
            label: 'Service',
            selectType: 'single',
            enum: Modality,
            options: optionsFromEnum(Modality),
            selectedOptions: preferences[key]
              ? // Map back from transformed value to original enum value
                preferences[key] === 'Therapy'
                ? [Modality.Therapy]
                : preferences[key] === 'Psychiatric'
                  ? [Modality.Psychiatric]
                  : []
              : []
          };
        }
        case 'timeOfTheDay': {
          return {
            key: 'timeOfTheDay',
            label: 'Time of Day',
            selectType: 'single',
            enum: TimeOfTheDay,
            options: optionsFromEnum(TimeOfTheDay),
            selectedOptions: preferences[key] ? [preferences[key]] : []
          };
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
        case 'deliveryMethod': {
          return {
            key: 'deliveryMethod',
            label: 'Delivery',
            selectType: 'single',
            enum: DeliveryMethod,
            options: optionsFromEnum(DeliveryMethod),
            selectedOptions: preferences[key] ? [preferences[key]] : []
          };
        }
        case 'location': {
          return [
            {
              key: 'state',
              label: 'State',
              selectType: 'single',
              enum: LocationState,
              options: optionsForState(),
              selectedOptions: preferences.location?.state
                ? [preferences.location.state]
                : []
            },
            {
              key: 'facility',
              label: 'Facility',
              selectType: 'single',
              enum: LocationFacility,
              options: optionsForFacility(preferences.location?.state),
              selectedOptions: preferences.location?.facility
                ? [preferences.location.facility]
                : []
            }
          ];
        }
        default: {
          return undefined;
        }
      }
    })
    .flat()
    .filter((f) => isFilterType(f));
};

// const filtersReversed: Partial<Record<keyof GetProvidersInputType, string>> =
//   Object.fromEntries(Object.entries(filters).map(([key, val]) => [val, key]));
export { updatePreferencesWithFilters, preferencesToFiltersArray };
