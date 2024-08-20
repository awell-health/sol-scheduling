import { GetProvidersResponseType } from '../../api';

export const mockProvidersResponse: GetProvidersResponseType = {
  data: [
    {
      gender: 'F',
      ethnicity: 'White',
      language: '',
      location: {
        facility: '',
        state: 'CO'
      },
      name: 'Katherine Price',
      email: '',
      id: '1489',
      clinicalFocus: [
        'ADHD',
        'Anxiety d/o',
        'Autism spectrum',
        'Gender dysphoria',
        'Trauma (including PTSD)'
      ]
    }
  ]
};
