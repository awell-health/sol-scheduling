import { z } from 'zod';

export enum EventDeliveryMethod {
  Telehealth = 'Telehealth',
  InPerson = 'In-Person'
}

export const EventDeliveryMethodSchema = z.nativeEnum(EventDeliveryMethod);
