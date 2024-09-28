import {
  LocationType,
  LocationTypeType,
  type SlotType,
  EventDeliveryMethod
} from '../../../lib/api';
import { isSameDay } from 'date-fns';

type FilterByLocationType = ({
  availabilities,
  location
}: {
  availabilities: SlotType[];
  location?: {
    facility?: string;
    confirmedLocation?: LocationTypeType;
  };
}) => SlotType[];

export const filterByLocation: FilterByLocationType = ({
  availabilities,
  location
}) => {
  const confirmedLocation = location?.confirmedLocation;
  const facility = location?.facility;

  if (confirmedLocation === undefined) return availabilities;

  if (confirmedLocation === LocationType.InPerson) {
    if (facility === undefined)
      return availabilities.filter(
        (slot) => slot.location === EventDeliveryMethod.Both
      );

    return availabilities.filter(
      (slot) =>
        slot.facility === facility && slot.location === EventDeliveryMethod.Both
    );
  }

  return availabilities;
};

type FilterByDateType = ({
  availabilities,
  date
}: {
  availabilities: SlotType[];
  date: Date | null;
}) => SlotType[];

export const filterByDate: FilterByDateType = ({ availabilities, date }) => {
  if (date === null) return availabilities;

  return availabilities.filter((slot) =>
    date ? isSameDay(slot.slotstart, date) : false
  );
};
