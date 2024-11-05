import { FC } from 'react';
import { upperFirst, isNil } from 'lodash-es';
import clsx from 'clsx';
import { ProviderAvatar } from '../../ProviderAvatar';
import { type SlotType, type GetProviderResponseType } from '@/lib/api';

export type BookingErrorProps = {
  provider?: GetProviderResponseType['data'] | null;
  slot?: SlotType;
  otherBookingData?: Record<string, unknown>;
};

export const BookingError: FC<BookingErrorProps> = ({
  provider,
  slot,
  otherBookingData
}) => {
  const bookingConfirmationError =
    'Something went wrong when trying to schedule your appointment.';
  const providerName = isNil(provider)
    ? 'Unknown'
    : `${provider?.firstName} ${provider?.lastName}`;
  return (
    <div>
      <p className={clsx('font-medium text-xl text-center m-0')}>
        {bookingConfirmationError}
      </p>
      <div className={clsx('card bg-base-100 shadow-md')}>
        <div className='card-body flex'>
          <div className={clsx('card-title justify-between')}>
            <div className={clsx('flex flex-col')}>
              <p className={'font-normal text-lg'}>
                You tried to schedule with
              </p>
              <p className={'font-semibold text-lg'}>{providerName}</p>
            </div>
            <ProviderAvatar name={providerName} image={provider?.image} />
          </div>
          <ul className={clsx('list-none p-0 m-0')}>
            <ListItem>
              <ListItem.Header>Time: </ListItem.Header>
              <time
                className={clsx('block')}
                dateTime={slot?.slotstart.toISOString() ?? 'Unknown'}
              >
                {slot?.slotstart.toLocaleString() ?? 'Unknown'}
              </time>
            </ListItem>
            {slot?.duration && (
              <ListItem>
                <ListItem.Header>Duration: </ListItem.Header>
                <div>{slot?.duration} minutes</div>
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
          <p className={clsx('font-medium text-xl text-center m-0')}>
            Please go back and try again.
          </p>
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
