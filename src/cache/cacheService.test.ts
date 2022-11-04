import 'reflect-metadata';
import { container } from 'tsyringe';
import { faker } from '@faker-js/faker';
import { CacheService } from './cacheService';
import * as mockableRedis from 'redis';

describe('cacheService_Tests_', () => {
  let cacheService!: CacheService;

  beforeEach(() => {
    cacheService = container.resolve(CacheService);
  });

  describe('init_Tests_', () => {
    test('init_CatchError_ThrowError', async () => {
      // arrange
      jest.spyOn(mockableRedis, 'createClient').mockImplementationOnce(() => {
        throw new Error();
      });

      // act / assert
      expect(async () => {
        await cacheService.init();
      }).rejects.toThrowError();
    });

    test('init_FailToConnect_ThrowError', async () => {
      // arrange
      const clientMock = jest
        .spyOn(mockableRedis, 'createClient')
        .mockImplementationOnce(() => {
          return {
            connect: function () {
              throw new Error();
            },
          } as any;
        });

      // act / assert
      expect(async () => {
        await cacheService.init();
      }).rejects.toThrowError();
    });

    test('init_SuccessfullyConnect_Resolve', async () => {
      // arrange
      const clientMock = jest
        .spyOn(mockableRedis, 'createClient')
        .mockImplementationOnce(() => {
          return {
            connect: function () {
              return;
            },
          } as any;
        });

      // act
      await cacheService.init();

      // assert
      expect(cacheService['cacheClient']).toBeDefined();
    });
  });

  describe('get_Tests_', () => {
    test('get_CatchError_ThrowError', async () => {
      // arrange
      jest
        .spyOn(cacheService['cacheClient'], 'get')
        .mockImplementationOnce(async () => {
          throw new Error();
        });

      // act / assert
      expect(async () => {
        await cacheService.get(faker.hacker.verb());
      }).rejects.toThrowError();
    });

    test('get_KeyNotFound_ReturnNull', async () => {
      // arrange
      jest
        .spyOn(cacheService['cacheClient'], 'get')
        .mockImplementationOnce(async () => {
          return null;
        });

      // act
      const result = await cacheService.get(faker.hacker.noun());

      // assert
      expect(result).toBeNull();
    });

    test('get_KeyFound_ReturnDeserializedValue', async () => {
      // arrange
      const expectedValue = faker.datatype.json();
      jest
        .spyOn(cacheService['cacheClient'], 'get')
        .mockImplementationOnce(async () => {
          return JSON.stringify(expectedValue);
        });

      // act
      const result = await cacheService.get(faker.hacker.noun());

      // assert
      expect(result).toEqual(expectedValue);
    });
  });

  describe('put_Tests_', () => {
    test('put_CatchError_ThrowError', async () => {
      // arrange
      jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
        throw new Error();
      });

      // act / assert
      expect(async () => {
        await cacheService.put(faker.hacker.noun(), faker.hacker.verb());
      }).rejects.toThrowError();
    });

    test('put_SerializeSetExpire_Return', async () => {
      // arrange
      const setMock = jest
        .spyOn(cacheService['cacheClient'], 'set')
        .mockImplementationOnce(async () => {
          return;
        });
      const expireMock = jest
        .spyOn(cacheService['cacheClient'], 'expire')
        .mockImplementationOnce(async () => {
          return;
        });

      // act
      await cacheService.put(faker.hacker.noun(), faker.datatype.json());

      // assert
      expect(setMock).toHaveBeenCalledTimes(1);
      expect(expireMock).toHaveBeenCalledTimes(1);
    });
  });
});
