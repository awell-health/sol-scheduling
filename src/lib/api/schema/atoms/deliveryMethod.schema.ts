import { z } from 'zod';

export enum DeliveryMethod {
  'Telehealth' = 'Telehealth',
  'InPerson' = 'In-Person'
}

export const DeliveryMethodSchema = z.nativeEnum(DeliveryMethod);

export type DeliveryMethodType = z.infer<typeof DeliveryMethodSchema>;
