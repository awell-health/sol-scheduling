import {
  DeliveryMethodSchema,
  GenderSchema,
  GetProvidersInputSchema,
  GetProvidersInputType
} from '../../../lib/api';
import { z } from 'zod';

/**
 * Transforms the `deliveryMethod` for Salesforce preferences.
 *
 * In the API, the `Both` option is not allowed, so undefined (="no preference") is used.
 * However, for Salesforce, we convert `undefined` to `"Both"` to indicate no preference.
 *
 * @param {DeliveryMethodType | undefined} deliveryMethod - The patient's preferred delivery method.
 * @returns {string} - "Telehealth", "In-Person", or "Both" (if undefined).
 */
const SalesforcePreferencesSchema = GetProvidersInputSchema.extend({
  deliveryMethod: z
    .union([DeliveryMethodSchema, z.undefined(), z.literal('')])
    .transform((value) => {
      return value === undefined ? 'Both' : value;
    }),
  gender: z.union([GenderSchema, z.undefined(), z.literal('')])
});

export type SalesforcePreferencesType = z.infer<
  typeof SalesforcePreferencesSchema
>;

export const preparePreferencesForSalesforce = (
  preferences: GetProvidersInputType
): z.infer<typeof SalesforcePreferencesSchema> => {
  return SalesforcePreferencesSchema.parse(preferences);
};
