import { FC } from 'react';
import { upperFirst } from 'lodash';
import classes from './ProviderSelection.module.scss';
import { Button } from '@awell-health/ui-library';
import ISO6391 from 'iso-639-1';
import { DEFAULT_PROFILE_IMAGE } from '../../lib/constants';
import { GetProvidersResponseType } from 'lib/api';
import { toFullNameState, toFullNameGender } from '../../lib/utils';

export type BaseProvider = GetProvidersResponseType['data'][number];

export interface Provider extends BaseProvider {
  profileImageUrl?: string;
}

export type ProviderSelectionProps = {
  providers: Provider[];
  onSelect: (id: string) => void;
  text?: {
    button?: string;
  };
};

export const ProviderSelection: FC<ProviderSelectionProps> = ({
  providers,
  onSelect,
  text
}) => {
  const { button = 'Book appointment' } = text || {};

  const providersLabel = providers.length === 1 ? 'provider' : 'providers';

  return (
    <div>
      <h2 className={classes.title}>
        We found{' '}
        <span>
          {providers.length} {providersLabel}
        </span>{' '}
        for you
      </h2>
      <div className={classes.provider_group}>
        {providers.map((provider) => (
          <div key={provider.id} className={`${classes.provider}`}>
            <div className={classes.header}>
              <img
                alt={provider.name}
                src={provider.profileImageUrl ?? DEFAULT_PROFILE_IMAGE}
                className={classes.headshot}
              />
              <div>
                <h3 className={classes.provider_name}>{provider.name}</h3>
                {provider?.location?.state && (
                  <span className={classes.speciality}>
                    {toFullNameState(provider.location.state)}
                  </span>
                )}
              </div>
            </div>
            <div className={classes.footer}>
              <div>
                <ul className={classes.provider_info_list}>
                  {provider.gender && (
                    <li>
                      <span>Gender: </span>
                      {toFullNameGender(provider.gender)}
                    </li>
                  )}
                  {provider.language && (
                    <li>
                      <span>Language: </span>
                      {ISO6391.getName(provider.language)}
                    </li>
                  )}
                  {provider.ethnicity && (
                    <li>
                      <span>Ethnicity: </span>
                      {provider.ethnicity}
                    </li>
                  )}
                  {provider.clinicalFocus && (
                    <li>
                      <span>Clinical focus: </span>
                      {provider.clinicalFocus
                        .map((_f) => upperFirst(_f))
                        .join(', ')}
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <Button
                  fullWidth={true}
                  variant='primary'
                  onClick={() => onSelect(provider.id)}
                >
                  {button}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
