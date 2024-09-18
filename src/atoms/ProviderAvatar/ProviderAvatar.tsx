import { FC } from 'react';
import clsx from 'clsx';

export type ProviderAvatarProps = {
  name: string;
  image?: string;
  classes?: string;
};

export const ProviderAvatar: FC<ProviderAvatarProps> = ({
  name,
  image,
  classes = 'w-16 h-16'
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');
  return (
    <div className='avatar'>
      <div className={clsx(`rounded-full ${classes} bg-slate-600`)}>
        {image ? (
          <img alt={name} src={image} />
        ) : (
          <span className='text-center text-white font-bold h-full flex items-center justify-center w-full'>
            {initials}
          </span>
        )}
      </div>
    </div>
  );
};
