import { z } from 'zod';

export enum DeliveryMethod {
  'Virtual' = 'virtual',
  'In-person' = 'in-person'
}

export const DeliveryMethodSchema = z.nativeEnum(DeliveryMethod);
