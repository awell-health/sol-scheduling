import { GetProviderResponseSchema } from '..';

export const getMockProviderResponse = () => {
  /**
   * You can copy-paste a raw API response in the safeParse
   */
  const res = GetProviderResponseSchema.safeParse({
    data: {
      location: {
        facility: '',
        state: 'NY - Brooklyn Heights'
      },
      name: 'Nick Hellemans',
      bio: "Nick Hellemans, Psy.D, LMSW, is an esteemed Psychotherapist with extensive experience in treating anxiety, depression, addictions, and personality disorders. She integrates a diverse range of therapeutic approaches and training, including Psychodynamic Therapy, Schema Therapy, Mentalization-based Therapy, Cognitive Behavioral Therapy and more. Luciana's tailored treatment approach is based on individual preferences and needs, emphasizing collaboration, trust, and creating a safe space for clients to address sensitive issues and overcome personal struggles with resilience and compassion.",
      image: '/profile-image.jpg',
      profileLink: 'https://solmentalhealth.com/providers/luciana-forzisi/'
    },
    errorMessage: '',
    errorCode: ''
  });

  if (!res.success) {
    console.error('Error in getMockProviderResponse', res.error.errors);
    throw new Error(JSON.stringify(res.error.errors));
  }

  return res.data;
};

export const mockProviderResponse = getMockProviderResponse();
