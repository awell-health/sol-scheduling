import { z } from 'zod';

export enum EventDeliveryMethod {
  Telehealth = 'Telehealth',
  Both = 'both'
}

export const EventDeliveryMethodSchema = z.nativeEnum(EventDeliveryMethod);
