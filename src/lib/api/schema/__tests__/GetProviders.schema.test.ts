import { expect, describe, it } from '@jest/globals';
import { GetProvidersInputSchema } from '../GetProviders.schema';
import { ZodError } from 'zod';

describe('GetProviders schema', () => {
  describe('Age validation', () => {
    it(`If age is a numeric string between the min and max age then it should return the number as a string`, () => {
      const preferences = {
        age: '18'
      };

      const res = GetProvidersInputSchema.parse(preferences);

      expect(res).toEqual({
        age: '18'
      });
    });

    it(`If age is a number between the min and max age then it should parse it to a string`, () => {
      const preferences = {
        age: 18
      };

      const res = GetProvidersInputSchema.parse(preferences);

      expect(res).toEqual({
        age: '18'
      });
    });

    it(`If age is a numeric string outside of the min and max age then it should set age to undefined`, () => {
      const preferences = {
        age: '101'
      };

      const res = GetProvidersInputSchema.parse(preferences);

      expect(res).toEqual({
        age: undefined
      });
    });

    it(`If age is a number outside of the min and max age then it should set age to undefined (so it gets omitted from the request)`, () => {
      const preferences = {
        age: 2
      };

      const res = GetProvidersInputSchema.parse(preferences);

      expect(res).toEqual({
        age: undefined
      });
    });

    it(`If age is not a number then it should throw an error`, () => {
      expect(() => {
        const preferences = {
          age: '18-24'
        };

        GetProvidersInputSchema.parse(preferences);
      }).toThrow(ZodError);
    });
  });
});
