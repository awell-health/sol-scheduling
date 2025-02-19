import { FC } from 'react';
import clsx from 'clsx';

export type ProviderAvatarProps = {
  name?: string;
  image?: string;
  classes?: string;
  loading?: boolean;
};

export const ProviderAvatar: FC<ProviderAvatarProps> = ({
  name,
  image,
  classes = 'w-16 h-16',
  loading = false
}) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
    : 'U';

  if (loading)
    return (
      <div
        className={`skeleton ${classes} bg-secondary rounded-full shrink-0`}
      />
    );

  return (
    <div className='avatar'>
      <div className={clsx(`rounded-full ${classes} bg-primary`)}>
        {image ? (
          <img alt={initials} src={image} referrerPolicy='no-referrer' />
        ) : (
          <span className='text-center text-secondary font-bold h-full flex items-center justify-center w-full'>
            {initials}
          </span>
        )}
      </div>
    </div>
  );
};
