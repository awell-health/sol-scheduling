import { z } from 'zod';

export enum DeliveryMethod {
  'Virtual' = 'virtual',
  'InPerson' = 'in-person'
}

export const DeliveryMethodSchema = z.nativeEnum(DeliveryMethod);
