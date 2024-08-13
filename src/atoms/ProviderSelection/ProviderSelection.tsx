import { FC } from 'react';
import { upperFirst } from 'lodash';
import classes from './ProviderSelection.module.scss';
import { Button } from '@awell-health/ui-library';
import ISO6391 from 'iso-639-1';
import { DEFAULT_PROFILE_IMAGE } from '../../lib/constants';
interface Provider {
  id: string;
  name: string;
  profileImageUrl?: string;
  language?: string;
  gender?: string;
  ethnicity?: string;
  therapeuticModality?: string;
  clinicalFocus?: string[];
  deliveryMethod?: string;
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

  return (
    <div>
      <h2 className={classes.title}>
        We found <span>{providers.length} providers</span> for you
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
                {provider.clinicalFocus && (
                  <span className={classes.speciality}>
                    {provider.clinicalFocus
                      .map((_f) => upperFirst(_f))
                      .join(', ')}
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
                      {provider.gender}
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
                  {provider.therapeuticModality && (
                    <li>
                      <span>Modality: </span>
                      {provider.therapeuticModality}
                    </li>
                  )}
                  {provider.deliveryMethod && (
                    <li>
                      <span>Delivery method: </span>
                      {provider.deliveryMethod}
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
