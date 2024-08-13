import { FC } from 'react';
import classes from './BookingConfirmation.module.scss';
import { DEFAULT_PROFILE_IMAGE } from '../../lib/constants';
import { upperFirst } from 'lodash';

export type BookingConfirmationProps = {
  providerName: string;
  date: Date;
  profileImageUrl?: string;
  duration?: number;
  otherBookingData?: Record<string, unknown>;
  text?: {
    bookingConfirmed?: string;
  };
};

export const BookingConfirmation: FC<BookingConfirmationProps> = ({
  providerName,
  date,
  profileImageUrl = DEFAULT_PROFILE_IMAGE,
  duration,
  otherBookingData,
  text
}) => {
  const {
    bookingConfirmed = '✨ Thank you! Your appointment is confirmed. ✨'
  } = text || {};

  return (
    <div>
      <h2 className={classes.title}>{bookingConfirmed}</h2>
      <div className={classes.card}>
        <div className={classes.header}>
          <div className={classes.meetingWith}>
            <h4>You are meeting with</h4>
            <h5>{providerName}</h5>
          </div>
          <img
            alt={providerName}
            src={profileImageUrl}
            className={classes.headshot}
          />
        </div>
        <ul className={classes.overview}>
          <li>
            <span>Time: </span>
            <time dateTime={date.toISOString()}>{date.toLocaleString()}</time>
          </li>
          {duration && (
            <li>
              <span>Duration: </span>
              <div>{duration} minutes</div>
            </li>
          )}
          {otherBookingData &&
            Object.entries(otherBookingData).map(([key, value]) => (
              <li>
                <span>{upperFirst(key)}: </span>
                <div>{String(value)}</div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
