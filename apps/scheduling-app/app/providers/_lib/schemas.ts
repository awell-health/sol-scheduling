import { z } from 'zod';
import { isEmpty, isNil } from 'lodash-es';

export enum Gender {
  Male = 'M',
  Female = 'F',
  NonBinaryOrNonConforming = 'Non-binary/non-conforming'
}

export enum Ethnicity {
  Asian = 'Asian',
  BlackOrAfricanAmerican = 'Black or African American',
  HispanicOrLatinx = 'Hispanic or Latinx',
  White = 'White',
  Other = 'Other'
}

export enum Language {
  Arabic = 'Arabic',
  Bulgarian = 'Bulgarian',
  Mandarin = 'Chinese (Mandarin)',
  Creole = 'Creole',
  French = 'French',
  German = 'German',
  Hebrew = 'Hebrew',
  Hindi = 'Hindi',
  Italian = 'Italian',
  Russian = 'Russian',
  Spanish = 'Spanish',
  Urdu = 'Urdu'
}

export enum Modality {
  Psychiatric = 'Psychiatric',
  Therapy = 'Therapy',
  Both = 'Both',
  NotSure = 'Not sure'
}

export enum ClinicalFocus {
  ADHD = 'ADHD',
  AngerManagement = 'Anger Management',
  Anxiety = 'Anxiety',
  Autism = 'Autism (ASD)',
  Bipolar = 'Bipolar Disorder',
  CouplesTherapy = 'Couples Therapy',
  Depression = 'Depression',
  DevelopmentalDisorders = 'Developmental Disorders',
  EatingDisorder = 'Eating Disorder',
  GriefAndLoss = 'Grief & Loss',
  IdentityIssues = 'Identity Issues',
  LifeTransitions = 'Life Transitions',
  OCD = 'OCD',
  RelationshipIssues = 'Relationship Issues',
  StressManagement = 'Stress Management',
  SubstanceUse = 'Substance Use',
  TraumaAndPTSD = 'Trauma & PTSD'
}

export enum DeliveryMethod {
  Telehealth = 'Telehealth',
  InPerson = 'In-Person'
}

export enum EventDeliveryMethod {
  Telehealth = 'Telehealth',
  InPerson = 'In-Person'
}

export enum LocationType {
  Telehealth = 'Telehealth',
  InPerson = 'In-Person'
}

export enum TimeOfTheDay {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening'
}

export enum LocationState {
  CO = 'CO',
  NY = 'NY',
  TX = 'TX',
  VA = 'VA',
  MD = 'MD',
  DC = 'DC'
}

export const LocationStateToNameMapping: Record<LocationState, string> = {
  CO: 'Colorado',
  NY: 'New York',
  TX: 'Texas',
  VA: 'Virginia',
  MD: 'Maryland',
  DC: 'Washington DC'
};

export enum LocationFacility {
  CherryCreek = 'CO - Cherry Creek',
  ColoradoSprings = 'CO - Colorado Springs',
  GreenwoodVillage = 'CO - Greenwood Village',
  CentralPark = 'CO - Central Park',
  Lakewood = 'CO - Lakewood',
  Boulder = 'CO - Boulder',
  HighlandsRanch = 'CO - Highlands Ranch',
  Broomfield = 'CO - Broomfield',
  Parker = 'CO - Parker',
  SilverSpring = 'MD - Silver Spring',
  Gaithersburg = 'MD - Gaithersburg',
  Frederick = 'MD - Frederick',
  Downtown = 'DC - Downtown',
  Ballston = 'VA - Ballston',
  Tysons = 'VA - Tysons',
  BrooklynHeights = 'NY - Brooklyn Heights',
  UnionSquare = 'NY - Union Square',
  LongIslandCity = 'NY - Long Island City',
  ColumbusCircle = 'NY - Columbus Circle',
  Williamsburg = 'NY - Williamsburg',
  WallStreet = 'NY - Wall Street',
  Astoria = 'NY - Astoria',
  Gowanus = 'NY - Gowanus',
  MidtownEast = 'NY - Midtown East',
  Manhasset = 'NY - Manhasset',
  Melville = 'NY - Melville',
  ValleyStream = 'NY - Valley Stream',
  Massapequa = 'NY - Massapequa',
  WhitePlains = 'NY - White Plains',
  Woodlands = 'TX - Woodlands',
  UpperKirby = 'TX - Upper Kirby',
  Austin = 'TX - Austin'
}

const transformEmptyToUndefined = <T extends z.ZodType>(schema: T) =>
  schema.transform((value) => {
    if (value === undefined) return undefined;
    if (typeof value === 'string' && value.trim().length === 0) return undefined;
    if (Array.isArray(value) && value.length === 0) return undefined;
    return value;
  });

export const AgeSchema = z.coerce
  .number()
  .transform((value) => (value < 6 ? undefined : String(value)));

export const GenderSchema = z.nativeEnum(Gender);

export const EthnicitySchema = z
  .union([z.nativeEnum(Ethnicity), z.string(), z.undefined()])
  .transform((value) => {
    if (isNil(value) || isEmpty(value)) return undefined;
    return value as Ethnicity;
  });

export const LanguageSchema = z.nativeEnum(Language).optional();

export const TherapeuticModalitySchema = z
  .nativeEnum(Modality)
  .optional()
  .transform((value) => {
    if (value === Modality.Therapy) return 'Therapy';
    if (!isEmpty(value)) return 'Psychiatric';
    return undefined;
  });

export const ClinicalFocusSchema = z.array(z.nativeEnum(ClinicalFocus));

export const DeliveryMethodSchema = z.nativeEnum(DeliveryMethod);

export const EventDeliveryMethodSchema = z.nativeEnum(EventDeliveryMethod);

export const LocationTypeSchema = z.nativeEnum(LocationType);

export const LocationStateSchema = z
  .union([z.nativeEnum(LocationState), z.literal('')])
  .optional()
  .transform((value) => {
    if (!value) return undefined;
    return value as LocationState;
  });

export const LocationFacilitySchema = z
  .union([z.nativeEnum(LocationFacility), z.literal('')])
  .optional()
  .transform((value) => {
    if (!value) return undefined;
    return value as LocationFacility;
  });

export const TimeOfTheDaySchema = z.nativeEnum(TimeOfTheDay).optional();

export const InsuranceSchema = z.string().optional();

export const ISO8601DateStringSchema = z.coerce.date();

export const errorSchema = z.object({
  errorMessage: z
    .string()
    .optional()
    .transform((v) => (isEmpty(v) ? undefined : v)),
  errorCode: z
    .string()
    .optional()
    .transform((v) => (isEmpty(v) ? undefined : v))
});

export const ProviderEventSchema = z.object({
  eventId: z.string(),
  date: ISO8601DateStringSchema,
  providerId: z.string(),
  slotstart: ISO8601DateStringSchema,
  duration: z.number(),
  facility: z.string(),
  location: EventDeliveryMethodSchema.optional(),
  eventType: DeliveryMethodSchema,
  booked: z.boolean().optional()
});

export const ProviderSchema = z.object({
  id: z.string(),
  location: z
    .object({
      facility: z.string().optional(),
      state: LocationStateSchema.optional()
    })
    .optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  profileLink: z.string().optional()
});

export const GetProvidersInputSchema = z.object({
  age: transformEmptyToUndefined(AgeSchema).optional(),
  gender: transformEmptyToUndefined(GenderSchema).optional(),
  ethnicity: transformEmptyToUndefined(EthnicitySchema).optional(),
  language: transformEmptyToUndefined(LanguageSchema).optional(),
  therapeuticModality: transformEmptyToUndefined(
    TherapeuticModalitySchema
  ).optional(),
  clinicalFocus: transformEmptyToUndefined(ClinicalFocusSchema).optional(),
  deliveryMethod: transformEmptyToUndefined(DeliveryMethodSchema).optional(),
  location: z
    .object({
      facility: LocationFacilitySchema.optional(),
      state: LocationStateSchema.optional()
    })
    .optional()
    .transform((location) => {
      if (isNil(location) || isEmpty(location)) return undefined;
      const { facility, state } = location;
      if (!facility && !state) return undefined;
      return { facility, state };
    }),
  timeOfTheDay: transformEmptyToUndefined(TimeOfTheDaySchema).optional(),
  insurance: transformEmptyToUndefined(InsuranceSchema).optional()
});

export const GetProvidersResponseSchema = z
  .object({
    data: z.array(
      ProviderSchema.merge(
        z.object({
          events: z
            .array(ProviderEventSchema)
            .optional()
            .transform((events) => {
              if (isNil(events) || events.length === 0) return [];
              return events;
            })
        })
      )
    )
  })
  .merge(errorSchema);

export const GetProviderResponseSchema = z
  .object({
    data: ProviderSchema
  })
  .merge(errorSchema);

export const GetAvailabilitiesResponseSchema = z
  .object({
    data: z.record(z.string(), z.array(ProviderEventSchema))
  })
  .merge(errorSchema);

export const BookAppointmentInputSchema = z.object({
  eventId: z.string(),
  providerId: z.string(),
  userInfo: z.object({
    userName: z.string(),
    salesforceLeadId: z.string().optional(),
    insuranceCarrier: z.string().optional()
  }),
  locationType: z.string()
});

export const BookAppointmentResponseSchema = z
  .object({
    data: z.unknown()
  })
  .merge(errorSchema);

export type SlotWithConfirmedLocation = z.infer<typeof ProviderEventSchema> & {
  confirmedLocation: LocationType;
};


