import { GetProvidersResponseSchema } from '..';

export const getMockProvidersResponse = () => {
  /**
   * You can copy-paste a raw API response in the safeParse
   */
  const res = GetProvidersResponseSchema.safeParse({
    data: [
      {
        gender: 'F',
        ethnicity: 'White',
        language: '',
        location: {
          facility: '',
          state: 'CO'
        },
        name: 'Lauren Jouzapaitis',
        id: '1637',
        clinicalFocus: [
          'Trauma (including PTSD)',
          'Eating d/o',
          'Anxiety d/o',
          'Developmental delay',
          'Dissociative d/o',
          'ADHD',
          'Gender dysphoria',
          'Depressive d/o'
        ],
        bio: 'I’m Lauren (she/her) and I am a trained art therapist with nine years of experience working in mental health settings. I recently received my Masters in Clinical Mental Health Counseling, concentrating in Transpersonal Art Therapy. Art therapy doesn’t require you to be experienced or “good” at making art. Working with an art therapist involves using art materials to access the subconscious and help you find meaning in your creative choices that relate to your life. It can also serve as a regulating tool when discussing challenging material. Overall, art therapy can help you understand yourself in a way that differs from traditional talk therapies.\nWe can use art therapy in our time together, or not! It’s up to you! I primarily use a Client-Centered approach, which is grounded in the idea that you own your potential for healing and the importance of co-collaboration between the therapist and client. In other words, you have a voice in your therapeutic journey, and I am here to support you without judgment.\r\nMy own artist identity allows me to be curious and creative in developing an integral individualized approach structured for you based on your own goals and strengths while anchored in relevant research. I also believe in cultivating long-term coping strategies to last beyond your time in therapy. Due to my contemplative education, I am also trained in meditation; this helps me stay present with you and integrate mindfulness-based approaches into our work together. In addition, somatic and expressive therapies guide me in assessing and incorporating movement into my therapeutic practices. If you are a creative individual who is open to trying something different, I’m your gal.\r\nMy experience includes residential and inpatient treatment settings, community-based work, clinical research, non-profits, and school settings. I am passionate about working with creative individuals and can work with children, adolescents, and adults who struggle with sensory processing challenges, disordered eating, adjustment challenges, and childhood trauma. I am social justice-oriented, LGBTQIA+ allied, and value cultural humility.\r\nIf it feels like a good fit for you, I am so excited to get to know you and support you on your journey!\r\n',
        image: 'profile-image.jpg',
        profileLink:
          'https://smh-dev.betsol.com/providers/arpan-parikh/?provider_id=1637',
        events: [
          {
            eventId: '3l0b8mt55dumr15munvpu6a7cg',
            date: '2024-09-17',
            providerId: '1637',
            slotstart: '2024-09-17T13:00:00Z',
            duration: 60,
            facility: 'CO - Cherry Creek',
            location: 'virtual only'
          },
          {
            eventId: 'a2qa6ececpacb952eqbb6sbeq0',
            date: '2024-09-17',
            providerId: '1637',
            slotstart: '2024-09-17T14:00:00Z',
            duration: 60,
            facility: 'CO - Cherry Creek',
            location: 'both'
          },
          {
            eventId: 'pl17mj3vh6d6t1sj7e4qsbvavg',
            date: '2024-09-17',
            providerId: '1637',
            slotstart: '2024-09-17T15:00:00Z',
            duration: 60,
            facility: 'CO - Cherry Creek',
            location: 'both'
          }
        ]
      },
      {
        gender: 'F',
        ethnicity: 'White',
        language: '',
        location: {
          facility: '',
          state: 'CO'
        },
        name: 'Jordan Gonzales',
        id: '1642',
        clinicalFocus: [
          'ADHD',
          'Anxiety d/o',
          'Depressive d/o',
          'Gender dysphoria',
          'Trauma (including PTSD)',
          'Anger management'
        ],
        bio: 'Jordan has been practicing counseling since 2016, and has experience in community, non-profit, and private practice settings. She’s worked with teens and adults who have experienced trauma, life transitions, self-esteem concerns, depression and anxiety. Jordan is passionate about providing a safe space for clients to express and understand themselves. She uses a client-centered approach, along with expressive arts, CBT and solution-focused therapy to help clients reach their goals.\nHer approach is playful, creative, and empowering. She also has experience providing therapeutic support for members of the LBGTQIA+ community.  Jordan received her master’s degree in counseling with a concentration in marriage and family therapy from Southeastern Louisiana University. She’s received training in Play Therapy and Trauma-focused Cognitive Behavioral Therapy.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2022/07/Jordan-Gonzales.png',
        profileLink:
          'https://smh-dev.betsol.com/providers/arpan-parikh/?provider_id=1642',
        events: [
          {
            eventId: 'b2istrgcu7chs2k17i66heoquc',
            date: '2024-09-18',
            providerId: '1642',
            slotstart: '2024-09-18T15:00:00Z',
            duration: 60,
            facility: 'CO - Greenwood Village',
            location: 'both'
          },
          {
            eventId: '5hu51qobg7jpsqa6lcg0ebk5m0',
            date: '2024-09-18',
            providerId: '1642',
            slotstart: '2024-09-18T16:00:00Z',
            duration: 60,
            facility: 'CO - Greenwood Village',
            location: 'both'
          },
          {
            eventId: '26fsgfn18olbt06rvo20jdjfg0',
            date: '2024-09-18',
            providerId: '1642',
            slotstart: '2024-09-18T17:00:00Z',
            duration: 60,
            facility: 'CO - Greenwood Village',
            location: 'both'
          }
        ]
      },
      {
        gender: 'F',
        ethnicity: 'White',
        language: '',
        location: {
          facility: '',
          state: 'NY'
        },
        name: 'Summer Johnke',
        id: '1733',
        clinicalFocus: [
          'Trauma (including PTSD)',
          'Dissociative d/o',
          'Anxiety d/o',
          'Depressive d/o',
          'Gender dysphoria',
          'OCD'
        ],
        bio: 'Summer Johnke, LMSW, graduated with a Masters of Social Work from Columbia University. Summer takes an integrative approach to therapy that draws from evidence-based, cognitive-behavioral modalities. Summer’s past clinical experience includes providing counseling in English, Spanish, and French to individuals coming from diverse cultural backgrounds with a focus on treating trauma and PTSD. Summer’s approach to therapy is culturally-sensitive, trauma-informed, and strengths-based. This flexible approach places each individual and their unique needs, preferences, identities, and culture at the center of every session. Summer is also a certified yoga instructor and weaves elements of somatic and mindfulness-based therapies into her practice. Above all, unconditional positive regard and a strong therapeutic alliance serve as the foundations for Summer’s practice. She seeks to meet each individual where they are at with radical acceptance, compassion, and an unwavering optimism in people’s potential to heal and transform.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2023/03/1-summer-johnke-e1679419932598.png',
        profileLink:
          'https://smh-dev.betsol.com/providers/arpan-parikh/?provider_id=1733',
        events: [
          {
            eventId: 'onaelbtp1esps6beuhjtj9n5cs',
            date: '2024-09-17',
            providerId: '1733',
            slotstart: '2024-09-17T12:00:00Z',
            duration: 60,
            facility: 'NY - Union Square',
            location: 'both'
          },
          {
            eventId: 'si8rekpo26dqlro4t37qh6m664',
            date: '2024-09-17',
            providerId: '1733',
            slotstart: '2024-09-17T13:00:00Z',
            duration: 60,
            facility: 'NY - Union Square',
            location: 'both'
          },
          {
            eventId: 'k502dms131icctm7sg2mnutl1o',
            date: '2024-09-17',
            providerId: '1733',
            slotstart: '2024-09-17T14:00:00Z',
            duration: 60,
            facility: 'NY - Union Square',
            location: 'both'
          }
        ]
      },
      {
        gender: 'F',
        ethnicity: 'White',
        language: '',
        location: {
          facility: '',
          state: 'CO'
        },
        name: 'Meggan Grant',
        id: '1759',
        clinicalFocus: [
          'ADHD',
          'Anger management',
          'Anxiety d/o',
          'Depressive d/o',
          'Gender dysphoria',
          'Bipolar spectrum',
          'Trauma (including PTSD)',
          'OCD',
          'Autism spectrum'
        ],
        bio: '',
        image: 'profile-image.jpg',
        profileLink:
          'https://smh-dev.betsol.com/providers/arpan-parikh/?provider_id=1733',
        events: [
          {
            eventId: 'pdmng9u1gmeh4fhg5mgjbfjpo8',
            date: '2024-09-17',
            providerId: '1759',
            slotstart: '2024-09-17T00:00:00Z',
            duration: 60,
            facility: 'CO - Highlands Ranch',
            location: 'both'
          },
          {
            eventId: '5qqivp0jghdep70h92eq842fvc',
            date: '2024-09-17',
            providerId: '1759',
            slotstart: '2024-09-17T14:00:00Z',
            duration: 60,
            facility: 'CO - Highlands Ranch',
            location: 'both'
          },
          {
            eventId: 'jpaba809bgt2lijp9tlaa4kcfo',
            date: '2024-09-17',
            providerId: '1759',
            slotstart: '2024-09-17T15:00:00Z',
            duration: 60,
            facility: 'CO - Highlands Ranch',
            location: 'both'
          }
        ]
      },
      {
        gender: 'F',
        ethnicity: 'White',
        language: '',
        location: {
          facility: '',
          state: 'NY'
        },
        name: 'Monet Mindell',
        id: '1779',
        clinicalFocus: [
          'Anxiety d/o',
          'Depressive d/o',
          'OCD',
          'Trauma (including PTSD)',
          'ADHD',
          'Bipolar spectrum'
        ],
        bio: '',
        image: '',
        profileLink: '',
        events: [
          {
            eventId: 'khfb00qgsgbkapopca77gmdjbo',
            date: '2024-09-17',
            providerId: '1779',
            slotstart: '2024-09-17T00:00:00Z',
            duration: 60,
            facility: 'NY - Brooklyn Heights',
            location: 'both'
          },
          {
            eventId: '5r68jv108h8p7c7grne2fniges',
            date: '2024-09-17',
            providerId: '1779',
            slotstart: '2024-09-17T14:00:00Z',
            duration: 60,
            facility: 'NY - Brooklyn Heights',
            location: 'both'
          },
          {
            eventId: 'dg6lq56bjmshods3cuo4oojtag',
            date: '2024-09-17',
            providerId: '1779',
            slotstart: '2024-09-17T15:00:00Z',
            duration: 60,
            facility: 'NY - Brooklyn Heights',
            location: 'both'
          }
        ]
      },
      {
        gender: 'F',
        ethnicity: 'White',
        language: '',
        location: {
          facility: '',
          state: 'NY'
        },
        name: 'Ioana Bontea',
        id: '1805',
        clinicalFocus: [
          'Anxiety d/o',
          'Depressive d/o',
          'Bipolar spectrum',
          'Psychosis (e.g., schizophrenia)',
          'Substance use'
        ],
        bio: 'I am deeply committed to providing holistic, evidence based, individual, and culturally informed care from a humanistic, integrative, and mindfulness perspective. Whether you are seeking a diagnosis, therapy, or need medication management, we will collaborate to identify your goals as well as you inner strengths and resiliency. My aim is to support you in finding your innate wisdom, becoming unstuck, and to guide you in your personal development in a healing and therapeutic environment.',
        image: 'profile-image.jpg',
        profileLink: '',
        events: [
          {
            eventId: '7999og23dk51f7abl9rspklf40',
            date: '2024-09-17',
            providerId: '1805',
            slotstart: '2024-09-17T12:00:00Z',
            duration: 60,
            facility: 'NY - Union Square',
            location: 'both'
          },
          {
            eventId: 'j2siq67be20bla7lm815ud6egs',
            date: '2024-09-17',
            providerId: '1805',
            slotstart: '2024-09-17T13:00:00Z',
            duration: 60,
            facility: 'NY - Union Square',
            location: 'both'
          },
          {
            eventId: 't6mtv3fjrgj0mj6bs6jna4rnpo',
            date: '2024-09-17',
            providerId: '1805',
            slotstart: '2024-09-17T14:00:00Z',
            duration: 60,
            facility: 'NY - Union Square',
            location: 'both'
          }
        ]
      },
      {
        gender: 'F',
        ethnicity: 'White',
        language: '',
        location: {
          facility: '',
          state: 'NY'
        },
        name: 'Luciana Forzisi',
        id: '1820',
        clinicalFocus: [
          'Trauma (including PTSD)',
          'Substance use',
          'Personality d/o',
          'OCD',
          'Gender dysphoria',
          'Depressive d/o',
          'Bipolar spectrum',
          'Anxiety d/o',
          'Anger management'
        ],
        bio: "Luciana Forzisi, Psy.D, LMSW, is an esteemed Psychotherapist with extensive experience in treating anxiety, depression, addictions, and personality disorders. She integrates a diverse range of therapeutic approaches and training, including Psychodynamic Therapy, Schema Therapy, Mentalization-based Therapy, Cognitive Behavioral Therapy and more. Luciana's tailored treatment approach is based on individual preferences and needs, emphasizing collaboration, trust, and creating a safe space for clients to address sensitive issues and overcome personal struggles with resilience and compassion.",
        image: 'profile-image.jpg',
        profileLink:
          'https://smh-dev.betsol.com/providers/arpan-parikh/?provider_id=1733',
        events: [
          {
            eventId: '5c9e98vcd2u53b269t5h1r87b8',
            date: '2024-09-17',
            providerId: '1820',
            slotstart: '2024-09-17T14:00:00Z',
            duration: 60,
            facility: 'NY - Brooklyn Heights',
            location: 'both'
          },
          {
            eventId: 'adt34qriqi1i4qgdjn9ujpl7kk',
            date: '2024-09-17',
            providerId: '1820',
            slotstart: '2024-09-17T15:00:00Z',
            duration: 60,
            facility: 'NY - Brooklyn Heights',
            location: 'both'
          },
          {
            eventId: 'm265h3e7d3v0klfmes2vskojbs',
            date: '2024-09-17',
            providerId: '1820',
            slotstart: '2024-09-17T16:00:00Z',
            duration: 60,
            facility: 'NY - Brooklyn Heights',
            location: 'both'
          }
        ]
      },
      {
        gender: 'F',
        ethnicity: 'White',
        language: '',
        location: {
          facility: '',
          state: 'CO'
        },
        name: 'Melanie Hane',
        id: '1824',
        clinicalFocus: [
          'ADHD',
          'Anxiety d/o',
          'Depressive d/o',
          'Anger management',
          'Substance use'
        ],
        bio: "I'm Mel and I am from Littleton, Colorado. My passion is to use therapy to help adolescents understand and navigate their nervous systems and how they interact with themselves and others to live a fun, balanced and fulfilled life, while achieving their goals. I use CBT, DBT, Motivational Interviewing, Strengths Based Therapy, and Play Therapy. I have experience working with children and adolescents ages 8-17 with depression, anxiety, adhd, substance use and emotional regulation. When I am not in the office, you can usually find me in the mountains, hiking, skiing, four wheeling, camping and backpacking or eating my favorite food, pizza.",
        image: 'profile-image.jpg',
        profileLink:
          'https://smh-dev.betsol.com/providers/arpan-parikh/?provider_id=1733',
        events: [
          {
            eventId: '933g58l74m6j0qve5r802kibvk',
            date: '2024-09-17',
            providerId: '1824',
            slotstart: '2024-09-17T14:00:00Z',
            duration: 60,
            facility: 'CO - Greenwood Village',
            location: 'both'
          },
          {
            eventId: 'qsa2p8kdqon53hg5p0mhrqq850',
            date: '2024-09-17',
            providerId: '1824',
            slotstart: '2024-09-17T15:00:00Z',
            duration: 60,
            facility: 'CO - Greenwood Village',
            location: 'both'
          },
          {
            eventId: 'ehb0ir42hhr3jf34jfqojlq1m8',
            date: '2024-09-17',
            providerId: '1824',
            slotstart: '2024-09-17T16:00:00Z',
            duration: 60,
            facility: 'CO - Greenwood Village',
            location: 'both'
          }
        ]
      }
    ],
    errorMessage: '',
    errorCode: ''
  });

  if (!res.success) {
    console.error('Error in getMockProvidersResponse', res.error.errors);
    throw new Error(JSON.stringify(res.error.errors));
  }

  return res.data;
};

export const mockProvidersResponse = getMockProvidersResponse();
