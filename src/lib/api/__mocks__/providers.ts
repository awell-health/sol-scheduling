import { GetProvidersResponseType } from 'lib/api';

export const mockProvidersResponse: GetProvidersResponseType = {
  data: [
    {
      name: '<provider_name1>',
      Id: '<provider_id1>',
      email: 'nick@awellhealth.com',
      ResourceId: '<provider_resouces_id1>',
      gender: 'M',
      ethnicity: 'Caucasian',
      language: 'en',
      location: {
        facility: 'f1',
        state: 'California'
      }
    },
    {
      name: '<provider_name2>',
      Id: '<provider_id2>',
      email: 'nick@awellhealth.com',
      ResourceId: '<provider_resouces_id2>',
      gender: 'M',
      ethnicity: 'African American',
      language: 'en',
      location: {
        facility: 'f2',
        state: 'New York'
      }
    }
  ]
};
