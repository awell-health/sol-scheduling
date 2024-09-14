import { FC } from 'react';
import { DEFAULT_PROFILE_IMAGE } from '../../lib/constants';
import { upperFirst } from 'lodash-es';
import { type SlotType } from '../../lib/api';
import clsx from 'clsx';

export type BookingConfirmationProps = {
  providerName: string;
  slot: SlotType;
  profileImageUrl?: string;
  otherBookingData?: Record<string, unknown>;
  text?: {
    bookingConfirmed?: string;
  };
};

export const BookingConfirmation: FC<BookingConfirmationProps> = ({
  providerName,
  slot,
  profileImageUrl = DEFAULT_PROFILE_IMAGE,
  otherBookingData,
  text
}) => {
  const {
    bookingConfirmed = '✨ Thank you! Your appointment is confirmed. ✨'
  } = text || {};

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
              <p className={'font-semibold text-lg'}>{providerName}</p>
            </div>
            <div className='avatar'>
              <div className={clsx('rounded-full w-16 h-16')}>
                <img alt={providerName} src={profileImageUrl} />
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
