import { FC } from 'react';
import classes from './ProviderSelection.module.scss';
import { Field, Radio, RadioGroup } from '@headlessui/react';

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  firstAvailability: Date;
}

export type ProviderSelectionProps = {
  value?: string;
  providers: Provider[];
  onSelect: (id: string) => void;
};

export const ProviderSelection: FC<ProviderSelectionProps> = ({
  value,
  providers,
  onSelect
}) => {
  return (
    <fieldset className={classes.fieldset} aria-label='Appointment type'>
      <RadioGroup value={value} onChange={onSelect} className={classes.group}>
        {providers.map((provider) => (
          <Field key={provider.id}>
            <Radio
              key={provider.id}
              value={provider.id}
              aria-label={`${provider.lastName} ${provider.firstName}`}
              className={`${classes.radio_option}`}
            >
              <div className={classes.flex_container}>
                <span className={classes.flex_col}>
                  <span className={classes.appointmentName}>
                    {provider.lastName} {provider.firstName}
                  </span>
                </span>
              </div>
            </Radio>
          </Field>
        ))}
      </RadioGroup>
    </fieldset>
  );
};
