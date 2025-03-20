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
  classes = 'sol-w-16 sol-h-16',
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
        className={`sol-skeleton ${classes} sol-bg-secondary sol-rounded-full sol-shrink-0`}
      />
    );

  return (
    <div className='sol-avatar'>
      {' '}
      <div className={clsx(`sol-rounded-full ${classes} sol-bg-primary`)}>
        {' '}
        {image ? (
          <img alt={initials} src={image} referrerPolicy='no-referrer' />
        ) : (
          <span className='sol-text-center sol-text-secondary sol-font-bold sol-h-full sol-flex sol-items-center sol-justify-center sol-w-full'>
            {initials}
          </span>
        )}
      </div>
    </div>
  );
};
