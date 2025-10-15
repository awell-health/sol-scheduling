import { GetProvidersResponseSchema } from '..';

export const getMockProvidersResponse = () => {
  /**
   * You can copy-paste a raw API response in the safeParse
   */
  const res = GetProvidersResponseSchema.safeParse({
    data: [
      {
        location: {
          facility: 'CO - Cherry Creek',
          state: ''
        },
        name: 'Brynn Vaughn',
        firstName: 'Brynn',
        lastName: 'Vaughn',
        id: '2110',
        bio: 'Brynn is a Licensed Social Worker (LSW) with experience providing trauma-informed care to individuals across the lifespan. She holds a Master of Social Work from Colorado State University with an advanced clinical behavioral health certification and has dedicated her career to helping others grow and heal.\r\n\r\nBrynn believes in a collaborative, strengths-based approach, tailoring treatment to each client’s unique needs. She integrates a variety of evidence-based modalities, including Eye Movement Desensitization and Reprocessing (EMDR), Cognitive Behavioral Therapy (CBT), Dialectical Behavioral Therapy (DBT), Parts Work, and Somatic Experiencing. She specializes in working with individuals navigating trauma, anxiety, life transitions, and identity exploration, particularly within diverse communities.\r\n\r\nWith warmth and compassion, Brynn fosters a safe and supportive environment where clients can develop insight, build resilience, and work toward meaningful change. She is committed to empowering clients on their journey toward healing and personal growth. If you’re ready to take the next step, Brynn is here to support you.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2025/02/brynn-vaughn-1.jpg',
        events: [
          {
            eventId: 'FE7A7BB8-DD9F-400C-823F-D97DC345AA9A',
            slotstart: '2025-04-18T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'E36FEEE1-1643-4E50-987D-686ADDFF6563',
            slotstart: '2025-04-18T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'CE821B63-68D5-4398-ABC5-C9A0C2C05D24',
            slotstart: '2025-04-18T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '41424D87-D84A-4943-ADB5-9224906C3863',
            slotstart: '2025-04-21T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '024E6B55-F1D0-4040-938C-A5013149B347',
            slotstart: '2025-04-21T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'F8EB1566-ACFD-4707-94AC-B3410BFB88E1',
            slotstart: '2025-04-21T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'F32E18A2-A088-4FCE-BD76-1E2FB304490F',
            slotstart: '2025-04-21T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'AFFA812E-0EB8-49C1-A2A7-5A55F1DB3809',
            slotstart: '2025-04-22T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '755676B5-E88D-4A3E-9DE0-1C8DD18B0628',
            slotstart: '2025-04-22T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'FEF31D1E-12F7-494E-BBBC-BA7EB7D7FB29',
            slotstart: '2025-04-22T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '9572984C-1450-47CD-B644-A0F929CCC00C',
            slotstart: '2025-04-23T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'F4EC4F26-6C9B-4B72-88FB-84A8526D08E1',
            slotstart: '2025-04-23T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'ABA00F25-889F-47ED-A730-2C0BBFEDF2D3',
            slotstart: '2025-04-23T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'EDBAFA74-A38D-4756-92CD-96AB1E8B04C2',
            slotstart: '2025-04-23T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '6BCAFCCD-A526-4BB0-A140-3BDBE028C860',
            slotstart: '2025-04-24T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'C47398E3-9A6F-4F61-AB45-CB9C803169F8',
            slotstart: '2025-04-24T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'D88DF261-A0FD-4700-A147-1B93E62409E0',
            slotstart: '2025-04-24T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'CFEF8065-6CD9-401E-B122-9B0BDFA17E2E',
            slotstart: '2025-04-25T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '47C8F02E-B3DC-4A00-8100-CE8B098FF072',
            slotstart: '2025-04-28T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '924D6A90-828D-4D54-9D06-C74AE4141F28',
            slotstart: '2025-04-28T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '295A8A9B-0787-4A74-8BF2-245E76793AC5',
            slotstart: '2025-04-28T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'F338016A-155F-41D8-AB4A-CB9FEDEA7993',
            slotstart: '2025-04-29T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '7D4948BF-10DF-434F-8BE0-B555173653B9',
            slotstart: '2025-04-29T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: 'A1957716-D45B-4DF1-8309-A95B743BFBDE',
            slotstart: '2025-04-29T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          },
          {
            eventId: '972A0420-A932-4D55-AE58-F95F47E518BA',
            slotstart: '2025-04-29T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2110',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Cherry Creek'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/brynn-vaughn/'
      },
      {
        location: {
          facility: 'CO - Boulder',
          state: ''
        },
        name: 'Bryan Handwork',
        firstName: 'Bryan',
        lastName: 'Handwork',
        id: '2038',
        bio: 'I spent much of my adult life working in Emergency Medicine as a Paramedic before going to the Physician Assistant program at Loma Linda University in Southern California. After graduating from there in 2018, I spent the past five years working in addiction medicine in a residential treatment program in Boulder, Colorado. Working in addiction medicine, I commonly assisted adult patients, of all ages, dealing with anxiety, depression, cravings, withdrawal symptoms and sleep challenges. Patients would often come to me wanting to reduce their amount of medications to just what was helpful and necessary and I would take a lot of pride in helping them achieve that goal. Genetic testing provides a helpful tool to initially choose, change or adjust a dose of a particular medication. I believe that it is important to meet an individual where they are in the healing process and to address the whole person rather than just the presenting problem or symptom. To address the “whole person” requires getting a detailed history and a partnership between patient and provider. Establishing such a partnership gives me great joy.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2024/11/Bryan-Handiwork.png',
        events: [
          {
            eventId: '231F7A0A-0BE9-4E8E-9034-965C2F3530A5',
            slotstart: '2025-04-18T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'F3EDD4D0-0312-4322-AB7C-629BF7D307C2',
            slotstart: '2025-04-18T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '6521EE27-4908-4B2C-B6F6-5DD373F70AD5',
            slotstart: '2025-04-18T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '29EB74C9-748F-4176-827C-16297429717B',
            slotstart: '2025-04-18T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'A950DA3A-F1CB-4F6E-A4C2-3247D0E645B1',
            slotstart: '2025-04-18T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '83545668-490B-4266-8B52-7A879C736E7B',
            slotstart: '2025-04-18T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '3EB66A4F-EB40-4C07-A14E-D1FBFA87808B',
            slotstart: '2025-04-18T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '063EC87B-99A5-4E58-B337-06878CF63C3B',
            slotstart: '2025-04-22T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '32A67DCB-8151-4516-980B-8A86DD62E29F',
            slotstart: '2025-04-22T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '1B1CC3C0-A1E4-47F9-8A45-8F0C283DCBFF',
            slotstart: '2025-04-22T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'FBE32078-01AF-4D7A-9BD4-A1C7855DDEDB',
            slotstart: '2025-04-22T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '8E8E0CBF-107C-4627-9715-186C6DEF0274',
            slotstart: '2025-04-22T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'E1B34A24-47A7-4B2E-B8AC-D8DD6186D6AB',
            slotstart: '2025-04-22T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '05EC261F-8E33-4B40-8A54-8B7E0B1BCFAC',
            slotstart: '2025-04-22T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'B8778653-4D3E-42CF-AFDE-04A40D08B2A7',
            slotstart: '2025-04-22T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '6533B29E-E0D3-4EBF-904B-13E6E3F87996',
            slotstart: '2025-04-22T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '9BCE67EF-7363-4DF2-8122-192856D67AF4',
            slotstart: '2025-04-23T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '454D4581-9CB4-455E-8F1A-7D12CB8EA053',
            slotstart: '2025-04-23T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'BA53BA6D-DCB7-4F31-88A2-1A077734EABF',
            slotstart: '2025-04-23T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '80CE954A-5FB1-4985-AF1F-2E578B8E058C',
            slotstart: '2025-04-23T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '70A7776F-AB14-47C3-8A11-85E8091A6AA5',
            slotstart: '2025-04-23T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '692361FC-2DDA-419B-A635-C6BFB4EBFC83',
            slotstart: '2025-04-23T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '9E77D4F5-EFAD-4DA8-A829-E3892F438D05',
            slotstart: '2025-04-23T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'B840FE29-38A6-40C3-9764-90245AE95352',
            slotstart: '2025-04-23T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'FCB52825-052A-4CA0-A06A-EC3FAE82AC7F',
            slotstart: '2025-04-24T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2038',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/bryan-handwork/'
      },
      {
        location: {
          facility: 'CO - Parker',
          state: ''
        },
        name: 'Christopher DiMarcella',
        firstName: 'Christopher',
        lastName: 'DiMarcella',
        id: '1948',
        bio: 'Therapy can be intimidating, finding the right therapist to work with, can feel downright overwhelming. My focus, in therapy, is to create a safe and meaningful space; a space where you feel respected and heard. Through building a meaningful relationship, we can foster growth and ultimately a place to heal. My focus is working with people struggling with life, whether it be anxiety, depression, or trauma. In addition to working with individuals, I also work with couples who may be struggling with their relationship and navigating healthy interactions. I am looking forward to getting to know you and supporting you through this process.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2024/11/Christopher-Dimarcella.png',
        events: [
          {
            eventId: '98A545A2-2755-42A4-B667-A7356DB70FA8',
            slotstart: '2025-04-18T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '2814F000-6727-481C-B738-035B738B58E8',
            slotstart: '2025-04-18T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: 'C31605FB-086E-4A0E-BB53-05E0F4DCFA5A',
            slotstart: '2025-04-21T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '8D0723E0-50AF-4AC4-AB1B-DE77366AB5F5',
            slotstart: '2025-04-21T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '8448153D-DF0D-425B-881A-39FCFC974E88',
            slotstart: '2025-04-21T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: 'DD3E2B27-81E6-494A-AF99-CA0FC4CE9CEB',
            slotstart: '2025-04-21T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '03508D9B-92F9-4BDF-86A7-B5D66E7D0120',
            slotstart: '2025-04-21T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '34A3D95D-716A-4F0A-93AE-9D3E32E1F979',
            slotstart: '2025-04-21T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '697BF6FB-CEC9-4D57-B881-26E4D6498595',
            slotstart: '2025-04-22T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '2B12A914-CE6B-40F3-946E-94A57D52605E',
            slotstart: '2025-04-22T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: 'DC858636-C428-4E5B-9263-5AECDEC8B161',
            slotstart: '2025-04-22T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: 'E2B7882E-0F3F-4E82-884A-A9CC90D0C7F2',
            slotstart: '2025-04-22T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: 'AA3D3BE7-5189-48EF-BD01-D3BA4DEDF594',
            slotstart: '2025-04-22T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '00A6E616-3884-4017-B601-8A983CA2AA63',
            slotstart: '2025-04-22T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '7CEE15C5-927F-460C-B284-8AF73CB10496',
            slotstart: '2025-04-22T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: 'A12A71EC-E990-43E1-B470-A7D8C96A3B88',
            slotstart: '2025-04-23T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '3EA6781D-FD22-4058-89A3-57F1D1B79963',
            slotstart: '2025-04-23T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: 'B29BA734-C46F-45E7-A65B-906086B1D598',
            slotstart: '2025-04-23T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '91B06B06-B2BF-44A2-829E-D2C1BB5222CC',
            slotstart: '2025-04-23T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '2CCA0A5E-5E8E-44BE-8531-FA1C8A6B9413',
            slotstart: '2025-04-23T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '5CB53C88-6E09-40D3-83FE-B52D50193861',
            slotstart: '2025-04-23T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: 'ABD6AD00-6C82-4EA2-91A3-B17325BC4D6D',
            slotstart: '2025-04-24T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '6821F55A-99D5-4398-B383-AAD3BFFDF1D1',
            slotstart: '2025-04-24T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '325F481B-EDA2-4F49-88F5-951EC38EA482',
            slotstart: '2025-04-24T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          },
          {
            eventId: '4D2D79FF-C136-4BA6-892B-B1976711495B',
            slotstart: '2025-04-24T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1948',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Parker'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/chris-dimarcella/'
      },
      {
        location: {
          facility: 'CO - Broomfield',
          state: ''
        },
        name: 'Kyle Graham',
        firstName: 'Kyle',
        lastName: 'Graham',
        id: '1750',
        bio: 'Kyle is a Marriage and Family Therapist Candidate in Colorado. He received his Masters of Arts in Marriage and Family Therapy from Northcentral University (now National University) in the Fall of 2020. Kyle has worked in community mental health, Intensive Outpatient substance abuse treatment, and private practice in Texas before making his long hoped for move to Colorado. Kyle enjoys working with adolescents, young adults, couples, and families through client-centered, strengths-based approaches to therapy. Primarily, he uses a mix of Solution-Focused Brief Therapy and Narrative Therapy with individuals and couples, while using some aspects of attachment based modalities with families. Kyle is currently being trained in EMDR and enjoys utilizing that training with clients seeking help with trauma, anxiety, and addictions.\nOutside of therapy, Kyle enjoys backpacking, hockey, and spending time with family.\n',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2023/04/kyle-graham.jpg',
        events: [
          {
            eventId: 'BF6AF5A1-0689-46AA-B00B-3826B2279DE7',
            slotstart: '2025-04-18T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: 'D73D7B1C-F1FD-4E1D-84A9-FEF6A8CC1B79',
            slotstart: '2025-04-21T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '8B817B04-21D3-4C8D-9545-F7FD22C84CE9',
            slotstart: '2025-04-21T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '14B2D0AD-DE99-428F-98C9-0DEB8763891E',
            slotstart: '2025-04-21T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '950F9D75-82FB-426E-84A7-C7178856F1C2',
            slotstart: '2025-04-21T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '60A3743A-8558-43A3-8A83-B264141240CB',
            slotstart: '2025-04-21T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: 'A1AD0DCB-2317-48FA-AE3B-32E4258CBD3E',
            slotstart: '2025-04-21T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '67BA576C-6689-4063-959C-557EE4699616',
            slotstart: '2025-04-22T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '6EBBE11E-56FB-436B-9A35-E27861AD3743',
            slotstart: '2025-04-22T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: 'F4A2CFCE-2EF8-4EBB-A6BA-BE0BA27B8438',
            slotstart: '2025-04-22T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '4C3BEF30-1F53-4BD3-99C9-F0B6ADDFD1C5',
            slotstart: '2025-04-23T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '66886588-CF9F-49C7-8F32-B31270FDB6BC',
            slotstart: '2025-04-23T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '7B1C613B-85FC-4F5D-BE88-FE0FF4C17C55',
            slotstart: '2025-04-23T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '934ED9D3-BFE2-4BEC-A209-A43BD85FE2C8',
            slotstart: '2025-04-24T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '3BB7A5D4-F281-42CB-A08A-42962A77488F',
            slotstart: '2025-04-24T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '8A4180DF-2A59-4429-9759-CE79872308A2',
            slotstart: '2025-04-24T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '0A6EDC88-43EC-4A5D-9A59-49B8C0502FC1',
            slotstart: '2025-04-24T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '247039F8-9D9C-45C1-94BF-FC52DD8323FE',
            slotstart: '2025-04-24T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: 'C0DCB95D-3107-4B23-AF53-41CF85DAE00F',
            slotstart: '2025-04-25T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: 'C14FDC1C-C61B-42B1-A106-106417772D55',
            slotstart: '2025-04-25T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '8AD9E800-B1C0-4186-AF44-1FB2D137648C',
            slotstart: '2025-04-25T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '579591B0-E70C-406E-9B66-43EE289F5C06',
            slotstart: '2025-04-25T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: 'FC474314-F438-432A-9C8F-6E0CCE0A599C',
            slotstart: '2025-04-28T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '0CDF7FD4-F3AC-4AFC-84EE-2CC8E632CEC7',
            slotstart: '2025-04-28T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          },
          {
            eventId: '573DDBA4-3741-4714-9AAC-B570A8127F7F',
            slotstart: '2025-04-28T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1750',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Broomfield'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/kyle-graham/'
      },
      {
        location: {
          facility: 'VA - Tysons',
          state: ''
        },
        name: 'Tanya Noblitt',
        firstName: 'Tanya',
        lastName: 'Noblitt',
        id: '13752',
        bio: 'Currently, I am open to working with ages 12+ regarding mental health, coping skills, trauma, grief and loss. I have worked with people with disabilities, addiction, community mental health, inpatient Palliative Care, and outpatient including families. Therapy is a place for people to come and grow, learn about themselves and the people around them. Investing in yourself brings empowerment and excitement to what lies ahead.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2024/03/Tanya-Noblitt.png',
        events: [
          {
            eventId: '9A8C4E37-D5D1-4E07-9B87-772CC297A369',
            slotstart: '2025-04-18T12:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: '7F99EE94-A055-41FC-AD8D-940C2AFAED3D',
            slotstart: '2025-04-18T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: '13D8ECA1-F5C7-40BD-A97B-0E1591A42A51',
            slotstart: '2025-04-18T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: 'AB88A7CD-4E42-4710-8167-0DAD5B40C303',
            slotstart: '2025-04-18T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: '1FCFAF9A-6667-4388-9571-F3813105DD40',
            slotstart: '2025-04-28T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: '69395978-84C0-4BF9-81E4-485E1DACD62B',
            slotstart: '2025-05-01T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: 'BD819864-EB05-4CF6-A469-7493BADF3CFF',
            slotstart: '2025-05-01T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: '1DC50DF6-2192-450B-B042-4A6A9BC544C0',
            slotstart: '2025-05-02T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: '161C1344-04B3-447A-989E-F08EA8BBBC07',
            slotstart: '2025-05-05T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: 'BE269553-FF43-46F3-8185-4B8EFDAEAC10',
            slotstart: '2025-05-07T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-07',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'VA - Tysons'
          },
          {
            eventId: '940B3412-5FCE-4901-9C88-6AEBA859D88A',
            slotstart: '2025-05-07T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-07',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'VA - Tysons'
          },
          {
            eventId: 'F7521067-0DB4-4C83-95A4-AB517D2379AB',
            slotstart: '2025-05-07T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-07',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'VA - Tysons'
          },
          {
            eventId: '4812EA31-D1D8-473F-BA44-6008BA148866',
            slotstart: '2025-05-08T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: '9ACDD27B-203C-49CE-A4BB-20177853EC37',
            slotstart: '2025-05-08T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          },
          {
            eventId: '0C100D4B-4F91-47FD-9F6B-AB2B81E76BCA',
            slotstart: '2025-05-08T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '13752',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Tysons'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/tanya-noblitt/'
      },
      {
        location: {
          facility: 'CO - Greenwood Village',
          state: ''
        },
        name: 'Sophia Graves',
        firstName: 'Sophia',
        lastName: 'Graves',
        id: '1671',
        bio: "Sophia is a Colorado native, who has received her masters degree from the University of Denver in Social Work with a concentration in mental health and a bachelor’s degree in Social Work from Colorado State University. Her style is structured to be strength-based. She seeks to provide a safe, trusting, and collaborative relationship with all clients. Sophia recognizes the value of a judgment free therapeutic relationship. In Sophia's therapeutic practice she utilizes the evidence-based treatment modalities of Dialectical Behavior Therapy, Acceptance Commitment Therapy, Cognitive Behavior Therapy, and Motivational Interviewing.",
        image:
          'https://solmentalhealth.com/wp-content/uploads/2023/07/Sophia-Graves.png',
        events: [
          {
            eventId: '9BB5C3D4-0ECC-47F5-98D2-70F3DECA4E80',
            slotstart: '2025-04-18T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '359E0A88-4E59-491A-80C4-6F7DE491FB45',
            slotstart: '2025-04-18T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '0C342511-6818-4C01-87A6-D07D796F377B',
            slotstart: '2025-04-18T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '36DA2F36-6359-4536-987C-9D9E617E8CA6',
            slotstart: '2025-04-21T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '94CAC5FB-4C0D-49AC-8AE1-0596831AF00C',
            slotstart: '2025-04-21T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '545F91B9-C064-412D-BFE6-09C2E6167D7E',
            slotstart: '2025-04-21T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '32AF4EFA-0B38-40F8-90D4-CE5CC3A18D21',
            slotstart: '2025-04-22T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '07978A9B-3764-4199-A63D-BF8079FF8D23',
            slotstart: '2025-04-22T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '04932C90-42BD-4BBC-914A-2A2FF8876B91',
            slotstart: '2025-04-22T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '623B2B43-B4BA-478E-B599-553E9344A2B6',
            slotstart: '2025-04-22T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '1485A32A-E4C1-4178-9B3E-8094F5FA625D',
            slotstart: '2025-04-24T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'DE27A8C2-D7B5-4C4A-AF4E-1DA165B24B31',
            slotstart: '2025-04-25T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '1BEE2194-1ED7-4052-9BAD-6F485C9B5D44',
            slotstart: '2025-04-25T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '86AD0E6F-203E-45E2-9912-0A5A4117F763',
            slotstart: '2025-04-28T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '966921BB-2A2F-44A5-847C-ACABE2C90B4D',
            slotstart: '2025-04-28T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '049B07E4-8DF7-421F-ACB2-EC0E0E9F7F3E',
            slotstart: '2025-04-29T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'CB30B4BF-3596-4DC4-914F-9395E7FECDBA',
            slotstart: '2025-04-29T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '5B2BD0C3-71B0-4E8C-8643-30ABB96FE669',
            slotstart: '2025-04-29T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'F12588F7-2687-4D11-BC8F-EC358764FFEC',
            slotstart: '2025-04-30T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '83B6BDA7-2043-46F4-B278-14BFA0E8DA56',
            slotstart: '2025-05-01T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '2C6C2669-D4E7-4054-A02E-095C857601F6',
            slotstart: '2025-05-01T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '9AC34221-F777-4B7C-A11D-D6368AEFCE63',
            slotstart: '2025-05-01T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '8FA4DBC8-2959-4A87-AA24-EB51F0E1BF92',
            slotstart: '2025-05-01T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '0FD0841C-D1D7-4188-8D50-6D8F45867382',
            slotstart: '2025-05-05T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'ED8DC81A-D0ED-4184-8801-3AFD1937AF4E',
            slotstart: '2025-05-05T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1671',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/sophia-graves/'
      },
      {
        location: {
          facility: 'MD - Frederick',
          state: ''
        },
        name: 'Cedric Rashaw',
        firstName: 'Cedric',
        lastName: 'Rashaw',
        id: '12254',
        bio: 'Cedric is a Licensed Clinical Professional Counselor (Maryland, DC, Virginia, Texas, Minnesota and Connecticut), and a Maryland Board Approved Clinical Supervisor. His clinical work experience spans 15 years and has included providing mental health services to a variety of clients including young children, pre-teens, adolescents, college students, adults, families, couples/marriage and at-risk males. He believes in empowering clients to accomplish their health and wellness goals through use of evidenced-based practices, outreach, and positive role modeling.\r\n\r\nAt SOL Mental Health, Cedric works with adults providing individual, family and couples therapy. His style incorporates a variety approaches including Cognitive Behavior Therapy (CBT), Rational Emotional Behavior Therapy (RBT), Solution Focused Therapy, Anger Management and Conflict Resolution to best meet the needs of his clients.\r\n\r\nIn addition to his work with clients, Cedric also provides clinical supervision to individuals and groups.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2023/05/Cedric-Reeshaw.png',
        events: [
          {
            eventId: '771B4EC8-D000-4454-82B9-C23E4D837E18',
            slotstart: '2025-04-18T12:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'C6B83DEF-7B6B-4ED6-A5E3-72ED54D62D00',
            slotstart: '2025-04-18T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '0AC7856B-7FA9-40BD-9FD3-3A24BDC9B73A',
            slotstart: '2025-04-21T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '8A7320E7-9E5E-4928-A93D-E05470DB6745',
            slotstart: '2025-04-21T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'ED0A6BE2-9DCF-404E-93A1-090A8BB82825',
            slotstart: '2025-04-21T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '524DCBB1-23AC-420B-BFC9-82D6A961780C',
            slotstart: '2025-04-21T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'B2F148A0-0463-4CD5-B43A-8348A7073C2C',
            slotstart: '2025-04-24T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '9E670B93-5A3A-4C02-A059-664E748FE631',
            slotstart: '2025-04-24T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '4F20D4F4-8D8A-40CD-9F59-F7DE1CD6FE2D',
            slotstart: '2025-04-25T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '3D7A16B0-BE3A-47FA-B0A0-096B75BA4DAF',
            slotstart: '2025-04-25T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '02F2CD5B-4292-4003-9C30-B41DCFFF5767',
            slotstart: '2025-04-28T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'D3497C2C-97BB-4194-BA10-46853E889930',
            slotstart: '2025-04-28T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'BF0DEAA1-C2C9-42E6-AF1A-AA0EE91F745A',
            slotstart: '2025-04-29T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'MD - Frederick'
          },
          {
            eventId: '358BFE99-EDDC-43BC-83A5-C4853C598E7F',
            slotstart: '2025-04-29T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'MD - Frederick'
          },
          {
            eventId: '09C5733F-DD1A-4E6E-B0DE-3777E1146C74',
            slotstart: '2025-05-01T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '49C47F56-71FB-4324-AB33-907E82546272',
            slotstart: '2025-05-01T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '308985AC-0B40-4D70-9186-269C8347841F',
            slotstart: '2025-05-01T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '66A4FB80-47DB-47F3-8970-DD64DBD2007C',
            slotstart: '2025-05-01T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'FD3C3C9D-B388-41C6-96BD-9F61ED3C30E9',
            slotstart: '2025-05-02T12:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '313E11CF-0729-412C-888E-E38E7B3A4963',
            slotstart: '2025-05-02T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '91EF488E-D5E4-4933-848C-029BC93BB555',
            slotstart: '2025-05-02T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'EC385148-4377-47AE-8D8A-9ECF77EEA11F',
            slotstart: '2025-05-05T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'B868AE3D-1B33-4B2F-8B87-C75F93161768',
            slotstart: '2025-05-05T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'EC159B42-E49E-4992-8C7A-901693BA7577',
            slotstart: '2025-05-05T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'E95E9B9E-6D31-46AF-9463-3113A6EDE482',
            slotstart: '2025-05-05T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '12254',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/cedric-rashaw/'
      },
      {
        location: {
          facility: 'CO - Highlands Ranch',
          state: ''
        },
        name: 'Chelsea Slay',
        firstName: 'Chelsea',
        lastName: 'Slay',
        id: '2050',
        bio: "I highly value authenticity not only in my personal life and also in my therapeutic work. I strive to provide a compassionate and authentic lens to provide support and place for folks to find their own authenticity and voice in their therapeutic work. In my 5+ years of eating disorder work, I emphasized values work, insight work, and self-compassion work. I'm not afraid to have hard conversations so that we can dig down into the challenges so that you can rise up in your own.",
        image:
          'https://solmentalhealth.com/wp-content/uploads/2024/11/Chelsea-Slay.png',
        events: [
          {
            eventId: '85C87AD6-B1ED-4FCF-886F-B92AC1990ECE',
            slotstart: '2025-04-18T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '90DC2EC6-D75E-46D7-80C6-BBF66D0A376E',
            slotstart: '2025-04-18T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '73212571-9194-4459-B466-A6FF57588FA7',
            slotstart: '2025-04-18T20:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '375E368D-C346-4D0D-986C-C360B81DE028',
            slotstart: '2025-04-21T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'C43B6769-2573-452F-94DF-21138F8FA97B',
            slotstart: '2025-04-21T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'FED2C0F7-5076-47E6-BC24-BBC284CF1056',
            slotstart: '2025-04-21T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '336C130D-80B7-456F-BA46-188E1B6AA85E',
            slotstart: '2025-04-21T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'F5E9E92B-5441-41CD-A009-5742FA3B049F',
            slotstart: '2025-04-21T20:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'E22CA7B0-36BD-4032-B266-751ED9DFD97E',
            slotstart: '2025-04-22T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '860F61AC-1D23-4177-A370-8E442CF03424',
            slotstart: '2025-04-22T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '10DE2168-48A9-4DCA-B00D-2673EC26A2CD',
            slotstart: '2025-04-22T20:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'C87ABC18-2560-4139-91CE-1BA11893405B',
            slotstart: '2025-04-22T21:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '54F5F528-6522-4373-9DA9-920F7C29F9F8',
            slotstart: '2025-04-23T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '3DA3D76E-184D-4A65-9B62-D0BEFEB81CCB',
            slotstart: '2025-04-23T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '3A645889-3338-459A-AB83-99A91B98C6E9',
            slotstart: '2025-04-23T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '4B99FBE2-F605-4208-9DD2-C0A22F029F3A',
            slotstart: '2025-04-24T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'D10015B9-C939-40A7-9C6B-8C473DB88276',
            slotstart: '2025-04-24T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '30638E41-B000-4438-A00F-67916E4A648C',
            slotstart: '2025-04-24T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '39407029-14E5-4E85-98DE-1278F2CB2FB3',
            slotstart: '2025-04-25T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '8841A8A4-38EB-46CD-AB1A-D91CDEAEA4C3',
            slotstart: '2025-04-25T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'B42E0685-8C8E-48EB-A705-1FAF6D75EB22',
            slotstart: '2025-04-25T20:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '6FAA7EAC-F01E-4614-9AE1-E9156FF0A538',
            slotstart: '2025-04-28T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '5C326B8B-BB0D-483F-9DB2-F24F4D9E5052',
            slotstart: '2025-04-28T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '1E5E848C-E281-4944-9369-6A167A86710B',
            slotstart: '2025-04-28T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'D4C080A6-8B97-4F92-A14E-AD292AAA054F',
            slotstart: '2025-04-28T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2050',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Highlands Ranch'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/chelsea-slay/'
      },
      {
        location: {
          facility: 'CO - Central Park',
          state: ''
        },
        name: 'Alexandra Pollack',
        firstName: 'Alexandra',
        lastName: 'Pollack',
        id: '2065',
        bio: 'Educational background and Clinical experience: Alex attended the University of Colorado in Boulder where she graduated in 2016 with a BA in International Relations with a concentration in Latin America. During Alex’s time at CU, she was an active volunteer with the non-profit organization, Health Outreach for Latin America (HOLA), going on many trips to Nicaragua to help open medical and veterinary clinics. With her experience in HOLA, Alex then fell in love with medicine. After graduating from CU Boulder, Alex received her EMT license and worked as an EMT in the Emergency Department at Denver Health Hospital for 3 years. She worked in the Emergency Room during the height of the COVID-19 pandemic before she was accepted to the Physician Assistant program at Rocky Vista University in the Fall of 2020. Alex then graduated with a master’s degree in physician assistant studies in 2022 and began working at Eating Recovery Center and Pathlight Mood and Anxiety in January 2023. While at ERC and Pathlight, Alex worked in many specialties including the adult mood and anxiety partial hospitalization program and the child and adolescent inpatient eating disorder program. With these patients, Alex treated a variety of mental health disorders while also working closely to collaborate with the other members of the treatment team including dieticians, nurses, therapists, and many other specialties. Alex then chose to move into the world of outpatient mental health in the fall of 2024\r\n\r\nAreas of expertise: Alex’s passion in working with patients of all ages and diagnoses is exemplified by the variety of locations in which she has treated patients since the start of her career in the medical field. With Alex’s unique experience treating eating disorders and other mental health diagnoses, she is especially talented at collaborating with other outpatient providers when treating both pediatric patients and adult patients.\r\n\r\nPersonal: Alex grew up in Monterey, California and feels deep appreciation for being raised in an incredibly beautiful part of the world. Alex and her family ‘s love of travel and experiencing different cultures brought her and her family to many different countries including Cape Town, South African where she lived for her entire freshman year of high school. Although Alex spent her childhood on the beach, she left the bay and moved to Colorado in 2012 to attend CU Boulder. Alex’s love for the ocean has not been forgotten but her appreciation for the mountains and all related activities has since flourished. As a provider, Alex decided to go into the field of mental health after one of her mentors noticed her innate ability to truly listen while helping her patients feel valued and understood. Since then, Alex has developed her role as a Physician Assistant who is patient, empathetic, and passionate about caring for her patients.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2024/11/alexandra-Pollock.png',
        events: [
          {
            eventId: '0F00B41E-A8C0-46AF-A937-B68A6487946E',
            slotstart: '2025-04-18T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'A0326436-F302-48F8-B66C-ED838A763A82',
            slotstart: '2025-04-23T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '712ABB6F-C48B-4986-9D4D-234F1EE46799',
            slotstart: '2025-04-24T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '5F087E15-4293-460F-A656-C18D494F1D14',
            slotstart: '2025-04-24T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '72B4C6A6-82BA-4987-8F42-35795737DDB1',
            slotstart: '2025-04-24T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'B6CA9870-1274-4118-8C35-24AEED2E9531',
            slotstart: '2025-04-25T13:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'C118673D-588A-4E67-A79C-E62BCFE9B0E8',
            slotstart: '2025-04-25T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'D069F698-7D12-41B0-AB6B-F01B69AA4D3F',
            slotstart: '2025-04-25T17:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '2D71A12B-36A3-4E00-A6B1-7574FAC212B5',
            slotstart: '2025-04-29T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'FD89314C-2340-4B29-9C2E-39C3DD820946',
            slotstart: '2025-04-29T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '39277AF9-124A-4AAE-B37C-5522B483C84A',
            slotstart: '2025-04-29T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '68A4DBDB-7646-44B7-90D8-3E55F4CF70F1',
            slotstart: '2025-04-29T20:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '81890D75-1ECD-4688-AE75-BD57FB344ED7',
            slotstart: '2025-04-30T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '979B6286-3995-48D7-99CA-5E3FD6F4E69E',
            slotstart: '2025-04-30T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'AEF4FBF7-461E-4E8B-B104-0651A6A7713B',
            slotstart: '2025-04-30T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '98D40949-3808-4691-AF04-47670EB64556',
            slotstart: '2025-04-30T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'E5B1A874-68ED-496E-9462-65C4BF1E5B0E',
            slotstart: '2025-04-30T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '319DAEBE-B220-4BBF-99F7-F9EB735A1DBA',
            slotstart: '2025-05-01T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'D6CF2FCA-1C9D-4C6B-9004-E45265CE4BC9',
            slotstart: '2025-05-01T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '89164E25-811B-4637-83FA-B01F49F813AC',
            slotstart: '2025-05-01T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'F1321B67-30DE-4893-9CF5-E1F1286AD191',
            slotstart: '2025-05-01T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '0069E3BA-7795-45A6-817B-B47CDC9B84B6',
            slotstart: '2025-05-02T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '0D0632F1-DF6D-43E5-AE35-B680615E447C',
            slotstart: '2025-05-02T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '81AAC3D0-7DE4-4619-9F89-B9BDA96EEC71',
            slotstart: '2025-05-02T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '4D329E0B-D347-4F5E-A895-39459D9743BD',
            slotstart: '2025-05-02T17:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2065',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/alexandra-pollack/'
      },
      {
        location: {
          facility: 'CO - Greenwood Village',
          state: ''
        },
        name: 'Amanda Poindexter',
        firstName: 'Amanda',
        lastName: 'Poindexter',
        id: '2066',
        bio: 'I am a board-certified Physician Assistant. I earned my master’s in physician assistant studies from the University of Colorado Child Health Associate/Physician Assistant (CHA/PA) Program. Prior to becoming a Physician Assistant, I was a clinical social worker. As a social worker, I worked in various settings including inpatient psychiatric hospital, residential program for adults with intellectual disabilities, and community mental health programs that provided services to at-risk youth. I completed my Bachelor of Social Work at Colorado State University and my Master of Social Work at the University of Denver.\n\nAfter practicing in various treatment settings as both a social worker and as a psych PA, I am driven to provide quality and compassionate behavioral healthcare across patients’ lifespans. As a clinician, I strive to facilitate a collaborative therapeutic relationship through a holistic and strengths-based approach. I enjoy understanding clients within a biopsychosocial-spiritual framework to better assess everyone’s unique needs as we work together toward treatment goals.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2024/11/amanda-poindexter.jpg',
        events: [
          {
            eventId: '548E4813-58D9-44D1-82A6-AE2F2CA98ED1',
            slotstart: '2025-04-18T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'E48FA449-ECB1-4BB1-858E-A05DBD1E2433',
            slotstart: '2025-04-18T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '2C3AD185-EFDB-4293-8E7F-573E7A125257',
            slotstart: '2025-04-18T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '4C7B8DA1-A06E-4D5D-A132-C9A2F7B46421',
            slotstart: '2025-04-22T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '85F26E57-87D8-4978-85A2-C4E4268CA135',
            slotstart: '2025-04-22T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '7F1FE916-47FB-4C03-8A69-764940FD9307',
            slotstart: '2025-04-22T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'DB2BDF18-1025-4A67-A18C-87198404D252',
            slotstart: '2025-04-22T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '3AC8A145-90FA-4478-917A-2F5506EB7765',
            slotstart: '2025-04-23T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '997970D7-1890-4757-B657-FDD9CBC7A90D',
            slotstart: '2025-04-23T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '4A8260FC-6D60-4CCA-B55C-17FEB81371D2',
            slotstart: '2025-04-23T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '0A01FD1F-F94E-4DD2-9C24-02C3FCAB5EA8',
            slotstart: '2025-04-24T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'D5D92719-B58E-4886-8786-A5B6ED460603',
            slotstart: '2025-04-24T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '0411EB29-C1F3-458A-8BF3-1A3CBA3D614A',
            slotstart: '2025-04-24T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '64FC7901-FB99-4A42-8D49-41AA9EAE6DD3',
            slotstart: '2025-04-24T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '8A9B712D-2A4E-4C25-986E-BB79E8E6E588',
            slotstart: '2025-04-24T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '3B0A90FF-C528-4252-8426-3E93B06CF500',
            slotstart: '2025-04-25T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'A025BD06-BA94-4AA1-A583-007F9FDECC7D',
            slotstart: '2025-04-25T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '033F8AD1-AA3B-4A81-805A-BA26E4E0220F',
            slotstart: '2025-04-25T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '36D6FFAD-EC04-47DD-84F3-627AEBFEA5EA',
            slotstart: '2025-04-25T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '2F342945-0A45-48E3-B6D3-B3E6B6FB3D43',
            slotstart: '2025-04-29T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '42158755-ADA1-4FA9-B885-14C3AE295A8B',
            slotstart: '2025-04-29T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'B8A723BF-A27D-44FA-9A14-527B647F4E54',
            slotstart: '2025-04-30T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: 'BB4234B9-C976-4E43-8CCC-4FF08D78CEBE',
            slotstart: '2025-04-30T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '7576737F-E062-4EDA-A0C3-0C10D207F544',
            slotstart: '2025-04-30T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          },
          {
            eventId: '953BC6A0-EDFE-4A63-A526-56E857C3FC97',
            slotstart: '2025-04-30T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2066',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Greenwood Village'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/amanda-poindexter/'
      },
      {
        location: {
          facility: 'CO - Boulder',
          state: ''
        },
        name: 'Jorge Borda',
        firstName: 'Jorge',
        lastName: 'Borda',
        id: '1712',
        bio: 'Jorge works as a Licensed Professional Counselor (LPC), has over 17 years of experience working with many different populations and backgrounds in the mental health field, and sees his work as a passion to support those who seek clarity during times of difficult challenges/transitions.\r\n\r\nJorge believes everyone has the potential to reach their desired goals so they may be in a place in their lives that creates balance, a sense of self-organization, and a positive stimulating experience. Using a genuine and compassionate approach that creates a safe place to express oneself, and working with you to help achieve your goals when it comes to dealing with both external (people, places, and things) and internal (behaviors, feelings, and thoughts) obstacles/stressors. Jorge utilizes a Reality/Choice Theory model that is an evidence-based treatment approach when focusing on the whole person be it emotional and physical health but also helping you with your insight into your situation through education/skill-building resources. Jorge also uses Cognitive Behavioral Therapy (CBT), Motivational Interviewing (MT), Mindfulness techniques, Psycho-Education, and other treatment approaches to help those on their current journey. Clinical background/interests include Adults, Anxiety, Crisis Management/Support, Depression, Domestic Violence Survivors, Eating Disorders, Elder Adults, LGBTQ populations, Mood Disorders, PTSD/Trauma, Refugee work (mainly Latin America), Self-Injury, and Psychosis.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2023/04/Jorge.png',
        events: [
          {
            eventId: 'FC493924-52C9-4E7C-B3D6-946F86D0AEC9',
            slotstart: '2025-04-18T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'D7C597FB-3612-4C61-BF7D-4E2D895F036B',
            slotstart: '2025-04-18T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '327A4DE8-2A7E-4FB7-9EDE-8C5740452968',
            slotstart: '2025-04-21T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'C3BF8D21-59E1-4809-A9B3-35E6AD7F92C9',
            slotstart: '2025-04-21T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '86DF26EF-B692-4096-B378-3D05E768E9BD',
            slotstart: '2025-04-21T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '5CB512A4-CAD2-4F57-9112-60A188877721',
            slotstart: '2025-04-21T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '7B07AC5D-B5E7-4B83-9FE5-005F43DE8ADD',
            slotstart: '2025-04-21T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '5B2E4CBC-35B4-411E-A035-F6527F3C4C84',
            slotstart: '2025-04-22T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'EA920DAF-2FB5-4940-91E7-EF15FBA403F0',
            slotstart: '2025-04-22T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Boulder'
          },
          {
            eventId: '60186A60-5D01-4B40-9E95-2757CA6F9D03',
            slotstart: '2025-04-22T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'A5CD2CAB-34F6-4500-8AD1-16FA38BE7A38',
            slotstart: '2025-04-23T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '523EEC97-F826-4277-B92F-766272991E44',
            slotstart: '2025-04-23T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '9EC5D105-9CBF-4F99-9428-EFDF34308927',
            slotstart: '2025-04-24T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Boulder'
          },
          {
            eventId: '732F4168-669F-4044-9DE7-9E00536B7F60',
            slotstart: '2025-04-24T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Boulder'
          },
          {
            eventId: '03DD0752-FC9C-42CF-8DE7-44AE19299031',
            slotstart: '2025-04-28T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '71A3023F-AABC-424B-852A-D34EB8532529',
            slotstart: '2025-04-28T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '457F1874-90D2-4FF4-A6DC-A1A3B008BBC5',
            slotstart: '2025-04-28T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '58B11C85-F2E3-4271-A947-7CAC13D2E866',
            slotstart: '2025-04-28T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: '690D5C7A-3A21-4FDD-B595-BDB48B070350',
            slotstart: '2025-04-28T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'F312F23A-E95C-4C01-8224-6BE6141BE3F2',
            slotstart: '2025-04-28T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'A58C6828-1097-44A5-B8ED-E5BE9540EE11',
            slotstart: '2025-04-29T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Boulder'
          },
          {
            eventId: '45791959-3C2A-4AA6-96AC-86B6666B0BBF',
            slotstart: '2025-04-29T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'BF92AE31-82DC-4BA9-AA77-08969C6A26B9',
            slotstart: '2025-04-29T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Boulder'
          },
          {
            eventId: '516730F0-D3CD-4BEF-B9B6-AEA52DA7A8DC',
            slotstart: '2025-04-29T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Boulder'
          },
          {
            eventId: 'D735ADD5-0BCB-44B3-9939-D3E672A532A5',
            slotstart: '2025-04-30T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1712',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Boulder'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/jorge-borda/'
      },
      {
        location: {
          facility: 'CO - Highlands Ranch',
          state: ''
        },
        name: 'Madlena Todorova',
        firstName: 'Madlena',
        lastName: 'Todorova',
        id: '1476',
        bio: 'In her work with clients, Maddie implements a strength-based approach and a strong belief that change is possible. She believes that challenges can be addressed and resolved, and even used for personal growth. Maddie views that her role as a therapist is to guide and empower individuals to tap into their own hidden wisdom and limitless potential.\r\n\r\nMaddie primarily uses Mindfulness-Based Cognitive Behavioral Therapy and Acceptance and Commitment Therapy as they both search for not only the symptoms but the roots of the problems. She incorporates and integrates a variety of evidence-based techniques and interventions as she does not believe that "One model fits all". Every individual is unique, and so is their story. Maddie tailors her approach to meet clients’ specific needs, goals, and aspirations and specializes in substance use and mood disorders, trauma, and attachment issues. She believes that when people adopt more adaptive behaviors and cognition, they open a door to a more fulfilling and happy life and a life that is true, authentic, and aligned with their true values.\r\n\r\nMaddie offers her clients years of diversified experience as well as a capacity for deep interpersonal connection and empathy.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2023/04/Maddie.png',
        events: [
          {
            eventId: '18F21DCB-64CE-457A-B9FD-6FA4AAF6DF82',
            slotstart: '2025-04-18T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'B9E434C3-088B-411B-9E3D-A8BC099FEDE3',
            slotstart: '2025-04-18T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '8FC70970-12FF-4231-B3FE-1D60883C9D47',
            slotstart: '2025-04-21T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '4789EB0D-EB34-4A98-83E6-090279CFFC14',
            slotstart: '2025-04-22T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '18DCA973-CA35-432D-B251-E9B3A36BFEFA',
            slotstart: '2025-04-22T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'B8E8B2A7-8FAC-4FDD-8348-7F89950FA68A',
            slotstart: '2025-04-23T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'CF1271DE-9380-4F38-B4A7-AC8DCD57DFE3',
            slotstart: '2025-04-24T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '74A9AB98-C2BE-40CE-842B-6C6258BD8FDD',
            slotstart: '2025-04-25T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '7213191B-5DB3-45E9-8FC0-965BA84447BC',
            slotstart: '2025-04-25T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '5B78F8F2-FD59-4E39-8182-BBF16BBF7CDB',
            slotstart: '2025-04-28T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '223FCEE9-2950-45A0-B618-0F5CB316A217',
            slotstart: '2025-04-29T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '0CF704DD-9E5A-483B-8F36-3635DCC0BB8B',
            slotstart: '2025-04-29T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '49A001DC-F194-4FCB-9409-27B4DC8716E5',
            slotstart: '2025-04-29T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '73E1935B-C8DB-4EB4-B758-8416CF1CD730',
            slotstart: '2025-04-30T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'F8DF13B9-E602-4E42-90DA-A5861F615A79',
            slotstart: '2025-04-30T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '005A2339-56E3-46E1-B224-33364F53CE6C',
            slotstart: '2025-05-01T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '5B54195A-C91D-4F22-A613-769F8813C1D6',
            slotstart: '2025-05-01T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '64812147-F37B-4B8C-8178-28E3E88F8676',
            slotstart: '2025-05-01T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '6EEEC905-C767-4841-8965-E82ACD2916F3',
            slotstart: '2025-05-02T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'D9FDD17C-AD75-4746-B97B-6289B2D90707',
            slotstart: '2025-05-05T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: 'D3D78F67-2237-40A5-B21A-897118A4422A',
            slotstart: '2025-05-06T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-05-06',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '07CB7DAC-6459-435A-87EF-41E61DAA945E',
            slotstart: '2025-05-07T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-05-07',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '495118A2-8355-4586-A083-F2C433933F8F',
            slotstart: '2025-05-08T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          },
          {
            eventId: '4E673F09-217C-456D-9179-68D027C6106D',
            slotstart: '2025-05-08T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1476',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Highlands Ranch'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/maddie-todorova/'
      },
      {
        location: {
          facility: 'NY - Wall Street',
          state: ''
        },
        name: 'Katy Anne Kimple',
        firstName: 'Katy Anne',
        lastName: 'Kimple',
        id: '2018',
        bio: 'My therapeutic approach is warm, direct, strength-based, and creative as we work through both past and present conflicts to achieve lasting change. I like to assess what your needs are and then pull from different therapeutic modalities to ensure that we can work together to try to meet those needs. I am a culturally-sensitive clinician, who emphasizes working transparently and collaboratively with clients of all backgrounds and orientations. I am a life-long learner whose practice is grounded in the belief that we all have the capacity to learn, grow, and heal. I specialize in working with folks who are experiencing anxiety, depression, peer and family relationship issues, grief or loss, and life transitions, not only due to my education and career background but also my own lived experiences. Artists, academics, and both youth and adult individuals adjusting to the demands of adulthood often find their way to my practice.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2024/06/Katy-Ann-Kimple.jpg',
        events: [
          {
            eventId: '68B187AE-1B6C-4C37-BDF1-E7257E4257E4',
            slotstart: '2025-04-18T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '7A574355-DA1C-42A0-85E0-2BB4F6FD5FD9',
            slotstart: '2025-04-18T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '8E14DE2B-369A-4B81-80E6-609898B67918',
            slotstart: '2025-04-23T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '00A940C3-EDEB-4D22-9CFA-9A560C6CB085',
            slotstart: '2025-04-24T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '70C75CBA-C761-4710-B9B3-8BDDD2077474',
            slotstart: '2025-04-25T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '28FAC28B-D18A-4F4D-A63E-0B91B39E3E79',
            slotstart: '2025-04-28T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: 'F1EF2365-67A2-472F-969B-E43BDFC240C0',
            slotstart: '2025-04-28T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: 'C4328010-2A5C-4AAF-95EF-2251AA32FC5A',
            slotstart: '2025-04-30T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '794B41CB-C36C-4F73-A912-2CE7E4C37944',
            slotstart: '2025-05-01T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: 'CD9F125B-1734-48D5-98FB-D71F7B77F29E',
            slotstart: '2025-05-02T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '3EE481E3-D0AE-4AF7-9F9C-544B38D34E2B',
            slotstart: '2025-05-02T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: 'AFDEDBFB-4CE9-4F89-B858-54D7AF821986',
            slotstart: '2025-05-05T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '489CFC82-AE90-40C5-9E2C-81CDDAFEB9A9',
            slotstart: '2025-05-05T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: 'B7D2DF36-0B57-4A12-84B1-1A260C6EFBBC',
            slotstart: '2025-05-05T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: 'A1F90DCD-F31F-4EAA-AD19-55D0429F0F49',
            slotstart: '2025-05-06T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-06',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '1BC6DADF-D2B9-40CA-B830-164362D80CDA',
            slotstart: '2025-05-06T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-06',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: 'A59FB122-5681-4464-A9B3-3E59A3C407D9',
            slotstart: '2025-05-06T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-06',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: 'A4D3F27F-285F-468E-9770-4F06B2D6912F',
            slotstart: '2025-05-06T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-06',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '7B6E69C0-F5F5-4C36-94A1-418E488C2114',
            slotstart: '2025-05-07T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-07',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          },
          {
            eventId: '191DC7C9-DCAC-49F7-902D-91109383DB7C',
            slotstart: '2025-05-08T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2018',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Wall Street'
          }
        ],
        profileLink:
          'https://solmentalhealth.com/providers/katy-rendinaro-kimple/'
      },
      {
        location: {
          facility: 'NY - Columbus Circle',
          state: ''
        },
        name: 'Edward Neve',
        firstName: 'Edward',
        lastName: 'Neve',
        id: '2098',
        bio: "Edward Neve received his Master's degree in Psychiatric - Mental Health Nursing from Hunter College. He also carries a Master's degree in Drama Therapy from New York University, allowing him to blend his passion for creative expression with the discipline of mental health treatment. He received his Bachelor's degree in Nursing from the University of Wisconsin - Eau Claire. He is a board-certified Psychiatric Mental Health Nurse Practitioner (PMHNP), allowing him to provide mental health care to individuals throughout the lifespan.\r\n\r\nEdward's journey in the mental health profession began over 15 years ago, taking him from group home settings, to inpatient psychiatry in various different hospitals in the New York area, to multiple private practices and community mental health outpatient centers. He has worked with individuals ranging from 5 years old to over 90 years old, allowing him to collaborate with healthcare professionals from a wide range of disciplines.\r\n\r\nEdward's unique path toward becoming a clinician has brought him to specialize in treating individuals with anxiety, depression, OCD, and trauma. He has extensive experience working with the LGBTQIA community and the unique challenges that they face in today's social landscape. His years studying both psychotherapy and psychopharmacology gives him a perspective that emphasizes the inseparable relationship between the two approaches in attaining one's mental health goals.\r\n\r\nEdward focuses on employing a client-centered approach by offering each individual the most up-to-date clinical expertise necessary to make the choices that will foster their own, unique vision of mental wellness. His passion for the arts and performance has allowed him to appreciate the value of a creative and innovative approach in providing mental health care. He strives to meet each individual where they are on their journey to wellness, appreciating the importance of patience and transparency in each therapeutic interaction. He works to create a safe, non-judgmental space that allows the individual to realize their own sense of wholeness and empowerment.",
        image:
          'https://solmentalhealth.com/wp-content/uploads/2025/01/Edward-Neve.jpg',
        events: [
          {
            eventId: '9C9B8DFB-8470-40B5-9F74-B558F655B410',
            slotstart: '2025-04-18T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: 'C5755725-EC74-4BA2-A80A-98F19B50549E',
            slotstart: '2025-04-18T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '88FAEB70-96EE-4379-AE24-4BEEB488A8E1',
            slotstart: '2025-04-21T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '70044A35-61C9-43EC-AAA3-B6FBABD92BDD',
            slotstart: '2025-04-21T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '12FA51B6-1946-49E6-A35E-807E5AB6ABE8',
            slotstart: '2025-04-21T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '9FE2CE0B-B8A3-43B0-90CF-2BAA11F8A73F',
            slotstart: '2025-04-21T20:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '2D315C6F-04D4-4CA3-8E40-A2216D8F575D',
            slotstart: '2025-04-21T21:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '5504028E-D5D9-41F6-8147-65784357927F',
            slotstart: '2025-04-22T13:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '97CC5D56-E18F-4189-9E1C-72002EB16877',
            slotstart: '2025-04-22T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: 'D5887A76-DB07-4BC4-BBDD-702C3C197B46',
            slotstart: '2025-04-22T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '3C5533D9-3B59-4A6F-986B-57FE63710DAA',
            slotstart: '2025-04-22T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '957541FA-4CD4-49DD-92D6-6108F89283C1',
            slotstart: '2025-04-22T20:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '641DF857-1B87-4FF4-B5FA-1F7D34E6D9CC',
            slotstart: '2025-04-23T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '68CA1208-5E43-4C7D-A2F4-6371C9F2C422',
            slotstart: '2025-04-23T15:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: 'CA482D8E-D66F-42EA-A0C9-7DCD7FBEE7AF',
            slotstart: '2025-04-23T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: 'A6CA59B8-B63C-405D-8A92-EB64E89939F2',
            slotstart: '2025-04-23T20:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: 'C6D12FFA-4C4F-422C-A208-BEB8D96E6B9C',
            slotstart: '2025-04-24T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '0F0EF52B-12AF-4143-9FFE-29EF9B140F5E',
            slotstart: '2025-04-24T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '42E45F9C-B585-4F36-84A8-C27C276DD110',
            slotstart: '2025-04-25T14:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: 'A6516C18-ECA7-423A-9CC0-373D89ABA0BF',
            slotstart: '2025-04-28T13:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: 'A9E579DE-E41D-46F4-AAE0-FEA9514F5E35',
            slotstart: '2025-04-28T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '9CCFFED1-02AD-4658-B14E-B1324B56E6C8',
            slotstart: '2025-04-28T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '046A0BD1-4625-4208-A555-D804ED1C53B0',
            slotstart: '2025-04-28T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: '3F70B870-8A5F-41C2-9FC3-FC321F0FCE05',
            slotstart: '2025-04-28T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          },
          {
            eventId: 'B9CC3139-C744-43FA-8EC3-2384DDC39EBE',
            slotstart: '2025-04-29T13:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2098',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Columbus Circle'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/edward-neve/'
      },
      {
        location: {
          facility: 'MD - Frederick',
          state: ''
        },
        name: 'Ashley Ellison',
        firstName: 'Ashley',
        lastName: 'Ellison',
        id: '14582',
        bio: "My journey has been dedicated to understanding and enhancing the human experience through empathy, education, and empowerment. This foundational ethos will be the cornerstone of my approach as a therapist, where I aspire to guide, support, and inspire individuals to reach their highest potential. Whether it's providing emotional support, developing coping strategies, or teaching practical skills, my goal has always been to make a meaningful impact on those I serve. In my role as a therapist, I am committed to creating an inclusive and supportive environment where you feel valued and understood. I believe that therapy is a collaborative process, and I strive to foster a space where questions are encouraged, curiosity is sparked, and knowledge is shared openly.\r\n",
        image:
          'https://solmentalhealth.com/wp-content/uploads/2024/08/Ashley-Ellison.jpg',
        events: [
          {
            eventId: '5603E771-5761-40E5-A942-2140B4B9E247',
            slotstart: '2025-04-18T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'CAD16947-2D97-4314-A3CC-B398140D6699',
            slotstart: '2025-04-18T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'E0FA637B-9195-4695-923E-573D417D6F05',
            slotstart: '2025-04-18T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'ECE021ED-361A-4EEE-BFCC-961DE938F83E',
            slotstart: '2025-04-18T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'E5932385-12D4-4993-8003-8B62F620DCB3',
            slotstart: '2025-04-18T17:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '33C9F22A-79A7-45EB-8206-5476E21CFC34',
            slotstart: '2025-04-18T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'A37D87E6-072C-424A-9E96-AE839674E854',
            slotstart: '2025-04-18T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'E37F51FA-6EDA-44C1-AA35-9BBC77A5E340',
            slotstart: '2025-04-18T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '93E49288-D8A4-442B-A085-D5B56EAD4021',
            slotstart: '2025-04-21T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '19A9733E-F480-4F3B-BF37-2B6D451E6E79',
            slotstart: '2025-04-21T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'C612AFFF-72FF-487D-A9E2-44C2911003CE',
            slotstart: '2025-04-21T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '61DEA8B6-3BAA-4837-B352-65B3D1EC97C2',
            slotstart: '2025-04-21T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '01F51FE8-149D-47BF-8BCC-407885F515EF',
            slotstart: '2025-04-22T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '37111F52-E2E5-404E-BD66-51D5BFCC4B89',
            slotstart: '2025-04-22T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '6B633C04-D7B5-49B2-9CB4-D767D5A683A1',
            slotstart: '2025-04-23T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '5C4806F2-E3CD-4BAF-B2DC-219071385EB4',
            slotstart: '2025-04-23T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'F7113CA3-C461-4B18-A428-D06CC599051D',
            slotstart: '2025-04-23T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'C53F9B67-E0B4-44C3-80CB-95E1C6F52E5B',
            slotstart: '2025-04-23T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '131147C1-D429-413F-A841-707257621E38',
            slotstart: '2025-04-23T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'FDDB3D1B-EFDD-4654-B397-70574CC7B7BD',
            slotstart: '2025-04-24T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '52653E6C-55E4-4480-82F8-1AF0EEFD2DC5',
            slotstart: '2025-04-24T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '2A37B6E4-42DD-4256-81AD-0286974D5B24',
            slotstart: '2025-04-24T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'D96CFF9F-4A5D-4510-A2F3-D68F3E65D991',
            slotstart: '2025-04-24T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: 'A5ECB2CB-0245-42EF-87A6-41C832AF6869',
            slotstart: '2025-04-24T17:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          },
          {
            eventId: '3CD7403D-025D-4213-B4FB-455D6A469390',
            slotstart: '2025-04-24T18:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14582',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'MD - Frederick'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/ashley-ellison/'
      },
      {
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
        events: [
          {
            eventId: '47048063-5A2B-498E-8B64-1AAD84297B48',
            slotstart: '2025-04-18T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'BF925A44-E309-415B-A3CE-BEB7E533E282',
            slotstart: '2025-04-18T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '2CFAB356-F2F2-40B7-9D2A-AD4759842AFB',
            slotstart: '2025-04-18T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'CBCA3CA7-F3F9-4F89-B333-93109148283F',
            slotstart: '2025-04-21T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'EBFFA895-A564-4E95-BEF1-629F18C9EA7D',
            slotstart: '2025-04-21T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '3FD03EF3-B950-4C05-99CB-C3A3CE048361',
            slotstart: '2025-04-22T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'DB2EE775-BA71-4107-9B19-6BF851A8E6DD',
            slotstart: '2025-04-22T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '127E84BB-1D29-4860-8FB8-8E044F20739E',
            slotstart: '2025-04-22T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '1209BD9D-8A4B-4A99-8628-1A2D1C178072',
            slotstart: '2025-04-22T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '5C035CB5-985B-425E-9A37-DCD76E6976D0',
            slotstart: '2025-04-23T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'B4D79307-0EC7-4755-A890-92F8250EC188',
            slotstart: '2025-04-24T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'FA0F5D97-224F-4A0A-8571-02FBD4607F8B',
            slotstart: '2025-04-24T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '7D362B2D-D4F4-4E94-B856-9989A5486EEE',
            slotstart: '2025-04-25T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '991D2827-C361-4AD6-915B-E9F40A10CB6B',
            slotstart: '2025-04-25T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '8EE09532-524D-4F7D-BF83-B67B9CF50545',
            slotstart: '2025-04-25T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '272FFBF4-C45A-491C-AE76-FD807ECFDF54',
            slotstart: '2025-04-25T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'C7DCA7D2-01B9-416A-864F-69E770B533E8',
            slotstart: '2025-04-25T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '3B8EA89A-25CC-42CC-B316-1FD9AE44EB16',
            slotstart: '2025-04-28T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '01E08976-1BD1-447D-B05E-A6B9F2D0374E',
            slotstart: '2025-04-28T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'D0BDB31F-CD2D-46E9-9DD1-2C3277BA180C',
            slotstart: '2025-04-28T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'D71E7FC7-F68E-489E-9756-4269C02F131E',
            slotstart: '2025-04-29T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '5D20626B-8CB1-49E5-9A15-156E5BA5ED1D',
            slotstart: '2025-04-29T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'EA33D272-A6CF-49B1-B45B-05DA4BF26FE8',
            slotstart: '2025-04-29T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'F1126B36-8F1B-45C0-8BAA-541354E56A40',
            slotstart: '2025-04-29T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'A5337A99-E2C6-40AB-BA13-27C71A9AE38C',
            slotstart: '2025-04-30T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1717',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/emery-philip/'
      },
      {
        location: {
          facility: 'NY - Long Island City',
          state: ''
        },
        name: 'Shakira Seeley',
        firstName: 'Shakira',
        lastName: 'Seeley',
        id: '1800',
        bio: 'Shakira is a Licensed Mental Health Counselor in New York state. Shakira completed her Master’s degree in Mental Health Counseling at Baruch College in New York City. She received her Bachelor’s degree in Psychology from Johnson &amp; Wales University in Providence, Rhode Island. Shakira has experience with delivering counseling sessions to clients of all ages while addressing related issues such as interpersonal relationships, work-life stressors, depression, anxiety, grief, substance abuse, and providing counseling to clients with open criminal court cases. Shakira enjoys working with clients who are seeking to improve their quality of life. Shakira’s main goal is to help her clients feel supported and encouraged to address issues at their own pace. Shakira is known for her transparency, professionalism, humor, and compassion.\r\n',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2023/06/Shakira-Seeley-Headshot-Sq.jpg',
        events: [
          {
            eventId: '3354AA1F-867B-4E54-A00F-40B0BFC7A953',
            slotstart: '2025-04-18T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: 'B27A546C-C5BC-43F8-9FF6-7366A5EA4C1F',
            slotstart: '2025-04-21T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '2F309BAF-F5A1-47DE-8060-D26BDF0A92B0',
            slotstart: '2025-04-21T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '0C89C6DE-7E5C-4EB0-A5B6-AB8209F1C404',
            slotstart: '2025-04-22T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '2858B48A-EA21-4A15-9D9A-99201E47A973',
            slotstart: '2025-04-28T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '2BA1FD20-9469-4DE4-9C4F-DFD7403F0B97',
            slotstart: '2025-04-29T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: 'B7F92197-19C0-4884-9FFB-26714C2B902D',
            slotstart: '2025-04-29T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: 'E24A7A3A-0323-4CC3-8982-51846B5CB22C',
            slotstart: '2025-04-29T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '096E08AA-C83A-44ED-98FB-8D1673525CE4',
            slotstart: '2025-04-30T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '778FAE88-C583-44A3-BC43-1970C9E7907A',
            slotstart: '2025-04-30T17:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '8CDE2AF3-7AF0-4E49-90F9-D8C4238BDD48',
            slotstart: '2025-04-30T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '3A3D5132-56EA-4444-80B5-4F27602A4AAB',
            slotstart: '2025-05-01T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '7172773A-7776-4EB4-B91A-3D5A0ACA7F83',
            slotstart: '2025-05-01T17:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '7ED26D77-B411-48DF-826C-7FCE676B67E5',
            slotstart: '2025-05-01T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-01',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '06BAC2D7-787C-44DC-B5B2-712394F0C3A2',
            slotstart: '2025-05-02T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '859D0C4D-87CF-452C-AD25-C7E9D12F6072',
            slotstart: '2025-05-02T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: 'BA28724B-763F-472B-8B3D-765A7CF86411',
            slotstart: '2025-05-05T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: 'EE525041-2A0D-4539-873C-FAC33121EECE',
            slotstart: '2025-05-05T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-05',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '1C438CAA-EF6A-4E3E-9798-46A70790B429',
            slotstart: '2025-05-06T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-06',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '0F709D79-332F-4F35-9271-E5D655F28563',
            slotstart: '2025-05-06T20:45:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-06',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '8CD4DD5E-EE29-4097-8663-9C86A52CB2F2',
            slotstart: '2025-05-08T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          },
          {
            eventId: '19CA8537-A069-4565-9247-510157D83E14',
            slotstart: '2025-05-08T16:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1800',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Long Island City'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/shakira-seeley/'
      },
      {
        location: {
          facility: 'CO - Central Park',
          state: ''
        },
        name: 'Meghan Dzatko',
        firstName: 'Meghan',
        lastName: 'Dzatko',
        id: '1840',
        bio: 'Is pain from your past or worries about the future making it hard to enjoy the present? Are you feeling stuck, disconnected, misunderstood? Do you want to have more fulfilling relationships with others and with yourself? Hi, I’m Meg, and I am excited you found my page.\r\n\r\nI work well with teens and adults looking to heal from past wounds, make change, and reconnect with themselves. In my approach, I utilize Cognitive Behavioral Therapy (CBT), Dialectical Behavioral Therapy (DBT), Internal Family Systems (IFS; also known as parts work), Motivational Interviewing, and Acceptance and Commitment Therapy (ACT), all through a trauma-informed lens to best support my clients. Creating a safe space for processing and fostering a strong therapeutic alliance with providing applicable skills is my job; your job is to show up, do the work, and to keep showing up, for yourself. Your story matters; let me help you rediscover and accept all the parts of what makes you, you.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2023/10/Meghan-Dzatko.png',
        events: [
          {
            eventId: '8E74D4FF-0E2F-4B9A-8C39-70FAD12CF1B5',
            slotstart: '2025-04-18T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '7F63DD66-7904-44AD-B65B-FF04EE253C3E',
            slotstart: '2025-04-22T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '3D2EC414-64A5-4371-858A-5ACBB084BDB7',
            slotstart: '2025-04-24T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '2B74E8C0-829D-49BC-9ED3-90EE892DBD2E',
            slotstart: '2025-04-24T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '8041B1D6-CB29-44C2-8C0C-52E567E14D9D',
            slotstart: '2025-04-29T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '5332875C-4046-4D43-AADB-3CA041574C4A',
            slotstart: '2025-04-29T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'CF20B9D3-A203-4A36-8F6A-2BFCDAF6D173',
            slotstart: '2025-04-29T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '75AC9E2B-A6AC-490A-B2E4-EDD98E92952E',
            slotstart: '2025-04-29T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '3DEEF1E6-0780-4A3F-9796-B0384DEE8F27',
            slotstart: '2025-04-30T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-04-30',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'D491EE2D-63CC-4601-878B-39F7AB55AF0E',
            slotstart: '2025-05-02T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '417E0049-7C85-442F-A77F-599C544F8666',
            slotstart: '2025-05-02T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-02',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'C6145F7D-6F5C-4EC5-9B20-1747A2496D58',
            slotstart: '2025-05-06T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-06',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'CO - Central Park'
          },
          {
            eventId: '3866267A-1E50-49A4-90A5-4448AB15464F',
            slotstart: '2025-05-07T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-07',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '79477C23-F3CB-47CA-8CC8-828F9F3CF51F',
            slotstart: '2025-05-07T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-07',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '8D5D0597-CE35-4A16-AE1D-7F131B15077D',
            slotstart: '2025-05-07T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-07',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '01490F99-ADE9-4780-B492-A5F6D77E3EFB',
            slotstart: '2025-05-07T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-07',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: 'F75504C5-A698-4F96-88B3-578E0378BC5D',
            slotstart: '2025-05-08T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '132E3513-07E5-4A7B-9DBE-2CD4CD2E7060',
            slotstart: '2025-05-08T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '8041E3DB-75D7-4A36-9A7C-B518BFC2C183',
            slotstart: '2025-05-08T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '363CD825-F32E-4711-8D8D-3E8E8515A4F8',
            slotstart: '2025-05-08T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          },
          {
            eventId: '49D9F1A3-13F9-49B0-AFD8-A7849F14B96E',
            slotstart: '2025-05-08T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '1840',
            date: '2025-05-08',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'CO - Central Park'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/meghan-dzatko/'
      },
      {
        location: {
          facility: 'VA - Ballston',
          state: ''
        },
        name: 'Marquincy Cottrell',
        firstName: 'Marquincy',
        lastName: 'Cottrell',
        id: '14382',
        bio: 'I understand that seeking therapy can be challenging for some and taking a courageous first step. Through active listening, empathy, and effective communication, my goal is to create a safe and non-judgmental space for clients to explore their thoughts, feelings, and experiences. I want clients to feel heard, validated and supported. If you are ready to embark on a journey of self discovery, growth, and healing, I am here to walk alongside you.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2024/11/Marquincy-Cottrell.png',
        events: [
          {
            eventId: 'E4B9023E-FB63-4546-81DC-09627FB574F3',
            slotstart: '2025-04-18T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'E215BD2C-299D-4B58-A4D3-76F1D3A629DB',
            slotstart: '2025-04-18T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'EB7C170B-909C-4C0F-A029-BC989D0B107C',
            slotstart: '2025-04-18T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'BFEFF9D6-227B-40F1-9F27-377BF6349189',
            slotstart: '2025-04-18T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'E7CB106A-DEB3-4632-9253-854C22470B67',
            slotstart: '2025-04-21T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'E61A3DD1-BF8A-421C-88BC-76C89812CF40',
            slotstart: '2025-04-21T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '9F6B3A2A-DFE9-4D58-991C-81EF3552A3BC',
            slotstart: '2025-04-21T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '4E4E1154-93F3-47D9-8F44-3DBA307001D9',
            slotstart: '2025-04-21T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'AC01324B-5172-4F1B-97E4-AE95310C17BE',
            slotstart: '2025-04-21T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'E8538131-16A5-4619-BCD1-207A629B1015',
            slotstart: '2025-04-21T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'F954E41B-1E15-477D-BCAD-5256C47EF2B0',
            slotstart: '2025-04-22T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'D44CF31A-BCB2-4111-8531-4149AE912447',
            slotstart: '2025-04-22T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '8A908535-43DB-42F8-803E-4942C2842B6B',
            slotstart: '2025-04-22T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '685798D1-F116-48C0-BDC4-2FC415C736F8',
            slotstart: '2025-04-22T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'FFE8A368-48F1-4628-BF3C-2D790C17BF65',
            slotstart: '2025-04-22T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'A728919F-3553-4D66-99CA-7EE409D564F9',
            slotstart: '2025-04-23T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '95AC5798-2282-4F19-B642-700B2E208104',
            slotstart: '2025-04-23T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '37DE342C-43CF-47BC-AC5E-D3F1E16E3E8C',
            slotstart: '2025-04-23T23:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'D633581C-FF6B-420A-B3B1-D366638F6CAD',
            slotstart: '2025-04-24T13:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '5F19F2DC-1EEC-4DAF-8FE2-0878A0AD3721',
            slotstart: '2025-04-24T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: 'F9FAE3CC-DA1C-4F73-B294-8E8BBCCA1271',
            slotstart: '2025-04-24T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '9586F676-A25B-48CE-98A8-441991BF3C52',
            slotstart: '2025-04-24T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '173D1009-7E2D-476F-B0DD-44B7656DFFEF',
            slotstart: '2025-04-24T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '2200427E-5714-4963-9A64-EF62861FFA63',
            slotstart: '2025-04-24T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          },
          {
            eventId: '8503FD79-33E3-4428-8F0C-ABDA3005E3A5',
            slotstart: '2025-04-25T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '14382',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'VA - Ballston'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/marquincy-cottrell/'
      },
      {
        location: {
          facility: 'NY - Brooklyn Heights',
          state: ''
        },
        name: 'Yinuo Dong',
        firstName: 'Yinuo',
        lastName: 'Dong',
        id: '2111',
        bio: 'I graduated from UGA with an undergrad Bachelor of Science from UGA with 2 years of research experience during that time and received my master’s in social work from NYU Silver in 2020 with specialized training in community leadership. During my time as a mental health case manager, I have completed training in SBIRT motivational interviewing. During my previous clinical position as a LMSW, I received my EFT training certificate in 2021 and DBT skills training in 2024.\r\n\r\nI have more than 8 years of experience in outpatient mental health settings, half of which was spent as a case manager specialist and more than 4 years of experience as a clinician. I have worked closely and successfully with individuals, families, couples, groups across all ages and backgrounds. As an immigrant, queer woman of color, I find myself to be able to compassionately provide a mirroring comfort for clients of all identities but especially those who might share similar identities as me.\r\n\r\nWhile some clients enter therapy with specific goals and I am more than willing to be of assistance, I pride myself as a culturally competent and community values forward professional with an understanding that each client has a unique system of support and challenges. My experience has been rather eclectic in terms of population I have worked with, I have come to feel connected to adolescents and immigrants who require specific lens of care. As a bilingual therapist able to provide sessions in Mandarin and English, I am eager to be of support for fellow members of the community who struggle to assimilate or navigate in the metropolitan NYC area.\r\n\r\nI have found my clinical approach to be blended from Gestalt, person in environment approach, and trauma informed lens. Throughout treatment, I also utilize a variety of CBT and DBT interventions when skills training is in order and my style can be described as motivational but compassionate. My past clients know me well to be able to match their pace, using various analogies and references from books I am reading and humor to get to know them.',
        image:
          'https://solmentalhealth.com/wp-content/uploads/2025/01/yinuo-dong.jpg',
        events: [
          {
            eventId: '1E044981-3DE2-43DD-9834-E28038A2CFFD',
            slotstart: '2025-04-18T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'BDB3F4CF-8FB5-4EE9-8801-488FCE343873',
            slotstart: '2025-04-18T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-18',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '1757DCEF-2948-47CC-ABC9-685103988998',
            slotstart: '2025-04-21T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'F78E9F32-317C-4571-BB7F-EB72D3735898',
            slotstart: '2025-04-21T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-21',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'AD8A5D27-05E0-4FAE-8103-30EAE4317A3D',
            slotstart: '2025-04-22T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '8065AD11-5932-4FF9-BCF2-366E241702AC',
            slotstart: '2025-04-22T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'A1EAF33D-1E59-4732-83E7-99AE0DC45921',
            slotstart: '2025-04-22T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '617BFA66-6A9B-403A-A8B8-232B68BF571A',
            slotstart: '2025-04-22T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '86B0AACD-565E-4CE3-B815-15B65F240CED',
            slotstart: '2025-04-22T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '562619D8-D846-4DDC-AE11-461C854E5C63',
            slotstart: '2025-04-22T20:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'FCDF119C-41D5-4C38-941D-3E72AA53CA53',
            slotstart: '2025-04-22T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '50655890-A705-492B-BC71-58D97991322E',
            slotstart: '2025-04-22T22:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-22',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'C13A46CC-123B-44E2-A1E9-A1EB651B4D58',
            slotstart: '2025-04-23T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-23',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'D94A1C0C-2E0A-4914-B421-C87385AA9846',
            slotstart: '2025-04-24T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '3217360B-780D-40DE-8BCD-99F270D4FF98',
            slotstart: '2025-04-24T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'BF68B35F-4DA9-4D15-92D5-60040E02E8BF',
            slotstart: '2025-04-24T18:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'DBB36B0C-B11B-4885-A44A-16061C31A0DE',
            slotstart: '2025-04-24T19:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'A07320D0-16C4-45DD-AA5B-E23C206ADE60',
            slotstart: '2025-04-24T21:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-24',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '72AB7B0B-1524-4E90-98AE-7F1E8EBBB3D6',
            slotstart: '2025-04-25T17:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-25',
            duration: 60,
            booked: false,
            eventType: 'In-Person',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'BDAF4CF5-DC3C-48D0-BD85-A089573B5948',
            slotstart: '2025-04-28T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '715ADD41-F6DF-44CE-ACB8-85BEFCA5A191',
            slotstart: '2025-04-28T19:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '924506EF-0CC5-4240-A22E-D56456EC821B',
            slotstart: '2025-04-28T20:30:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-28',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: 'D254DD84-3AD6-4E7A-B97A-2DA47D6F9578',
            slotstart: '2025-04-29T14:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '0D0F86F2-72C9-4B56-81A5-E472D6631F34',
            slotstart: '2025-04-29T15:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          },
          {
            eventId: '654E92FC-D4D8-4C62-9CBE-FDF800C49347',
            slotstart: '2025-04-29T16:00:00Z',
            provider: {
              location: {
                facility: '',
                state: ''
              }
            },
            providerId: '2111',
            date: '2025-04-29',
            duration: 60,
            booked: false,
            eventType: 'Telehealth',
            facility: 'NY - Brooklyn Heights'
          }
        ],
        profileLink: 'https://solmentalhealth.com/providers/yinuo-dong/'
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
