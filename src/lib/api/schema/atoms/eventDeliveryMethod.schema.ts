import { z } from 'zod';

export enum EventDeliveryMethod {
  'VirtualOnly' = 'virtual only',
  'Both' = 'both'
}

export const EventDeliveryMethodSchema = z.nativeEnum(EventDeliveryMethod);
