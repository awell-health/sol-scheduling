import { GetProviderResponseSchema } from '..';

export const getMockProviderResponse = () => {
  /**
   * You can copy-paste a raw API response in the safeParse
   */
  const res = GetProviderResponseSchema.safeParse({
    data: {
      location: {
        facility: 'NY - Brooklyn Heights',
        state: ''
      },
      name: 'Emery Philip',
      firstName: 'Emery',
      lastName: 'Philip',
      id: '1717',
      bio: 'Emery Philip, P-MHC, graduated with a masters of Clinical Mental Health Counseling from Molloy University. Emery believes that we all have more power than we realize. Utilizing person-centered approach because you are the expert of yourself. Together, we create a therapeutic environment that is safe, supportive, and non-judge mental so you can be your most authentic self.\n',
      image:
        'https://solmentalhealth.com/wp-content/uploads/2023/04/emery-philip.jpg',
      profileLink: 'https://solmentalhealth.com/providers/emery-philip/'
    }
  });

  if (!res.success) {
    console.error('Error in getMockProviderResponse', res.error.errors);
    throw new Error(JSON.stringify(res.error.errors));
  }

  return res.data;
};

export const mockProviderResponse = getMockProviderResponse();
