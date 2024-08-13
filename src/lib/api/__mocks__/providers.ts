import { GetProvidersResponseType } from 'lib/api';

export const mockProvidersResponse: GetProvidersResponseType = {
  data: [
    {
      name: '<provider_name1>',
      providerId: '<provider_id1>',
      providerResourceId: '<provider_resouces_id1>',
      gender: '<M/F>',
      ethnicity: '<ethnicity_string1>',
      language: '<language_name1>',
      location: '<location_string1>'
    },
    {
      name: '<provider_name2>',
      providerId: '<provider_id2>',
      providerResourceId: '<provider_resouces_id2>',
      gender: '<M/F>',
      ethnicity: '<ethnicity_string2>',
      language: '<language_name2>',
      location: '<location_string2>'
    }
  ]
};
