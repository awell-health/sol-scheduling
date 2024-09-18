import { FC } from 'react';
import { upperFirst } from 'lodash-es';
import clsx from 'clsx';
import { GetProvidersInputType, type SlotType } from '@/lib/api';
import { DEFAULT_PROFILE_IMAGE } from '@/lib/constants';
import { usePreferences } from '@/PreferencesProvider';

export type BookingConfirmationProps = {
  onCompleteActivity: (
    slot: SlotType,
    preferences: GetProvidersInputType
  ) => void;
  otherBookingData?: Record<string, unknown>;
  text?: {
    bookingConfirmed?: string;
  };
};

export const BookingConfirmation: FC<BookingConfirmationProps> = ({
  otherBookingData,
  onCompleteActivity,
  text
}) => {
  const {
    bookingConfirmed = '✨ Thank you! Your appointment is confirmed. ✨'
  } = text || {};

  const { bookingInformation } = usePreferences();
  const { provider, slot, preferences } = bookingInformation;

  if (!provider || !slot) {
    return (
      <div>
        Something went wrong. Please return to the booking page and try again.
      </div>
    );
  }

  void onCompleteActivity(slot, preferences);

  return (
    <div>
      <p className={clsx('font-medium text-xl text-center m-0')}>
        {bookingConfirmed}
      </p>
      <div className={clsx('card bg-base-100 shadow-md')}>
        <div className='card-body flex'>
          <div className={clsx('card-title justify-between')}>
            <div className={clsx('flex flex-col')}>
              <p className={'font-normal text-lg'}>You are meeting with</p>
              <p className={'font-semibold text-lg'}>{provider.name}</p>
            </div>
            <div className='avatar'>
              <div className={clsx('rounded-full w-16 h-16')}>
                <img
                  alt={provider.name}
                  src={provider.image ?? DEFAULT_PROFILE_IMAGE}
                />
              </div>
            </div>
          </div>
          <ul className={clsx('list-none p-0 m-0')}>
            <ListItem>
              <ListItem.Header>Time: </ListItem.Header>
              <time
                className={clsx('block')}
                dateTime={slot.slotstart.toISOString()}
              >
                {slot.slotstart.toLocaleString()}
              </time>
            </ListItem>
            {slot.duration && (
              <ListItem>
                <ListItem.Header>Duration: </ListItem.Header>
                <div>{slot.duration} minutes</div>
              </ListItem>
            )}
            {otherBookingData &&
              Object.entries(otherBookingData).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItem.Header>{upperFirst(key)}: </ListItem.Header>
                  <div>{String(value)}</div>
                </ListItem>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ListItem: FC<{ children: React.ReactNode }> & {
  Header: FC<{ children: React.ReactNode }>;
} = ({ children }) => {
  return (
    <li className={clsx('py-4 border-t-slate-200 border-t')}>{children}</li>
  );
};

ListItem.Header = ({ children }) => {
  return <div className={clsx('font-bold')}>{children}</div>;
};
ListItem.Header.displayName = 'ListItemHeader';
