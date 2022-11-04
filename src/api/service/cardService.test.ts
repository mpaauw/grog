import 'reflect-metadata';
import { container } from 'tsyringe';
import { faker } from '@faker-js/faker';
import { CardService } from './cardService';
import { DocumentNotFoundError } from 'ottoman';
import { GrogCard } from '../../common/model/grogCard';
import { DataSource } from '../../common/model/dataSource';

describe('cardService_Tests_', () => {
  let cardService!: CardService;

  beforeEach(() => {
    cardService = container.resolve(CardService);
  });

  describe('getCard_Tests_', () => {
    test('getCard_CatchError_ThrowError', async () => {
      // arrange
      jest
        .spyOn(cardService['cacheService'], 'get')
        .mockImplementationOnce(async () => {
          throw new Error();
        });

      // act / assert
      expect(async () => {
        await cardService.getCard(faker.hacker.noun());
      }).rejects.toThrowError();
    });

    test('getCard_CardNotFoundInCacheOrDatabase_ThrowDocumentNotFoundError', async () => {
      // arrange
      jest
        .spyOn(cardService['cacheService'], 'get')
        .mockImplementationOnce(async () => {
          return null;
        });
      jest
        .spyOn(cardService['databaseService'], 'findOne')
        .mockImplementationOnce(async () => {
          throw new DocumentNotFoundError();
        });

      // act / assert
      expect(async () => {
        await cardService.getCard(faker.hacker.verb());
      }).rejects.toThrowError(DocumentNotFoundError);
    });

    test('getCard_CardNotFoundInCacheButFoundInDatabase_ReturnCardDocument', async () => {
      // arrange
      const expectedResult = new GrogCard<any>(
        faker.hacker.phrase(),
        DataSource.Scryfall,
        faker.datatype.json()
      );
      const cacheGetMock = jest
        .spyOn(cardService['cacheService'], 'get')
        .mockImplementationOnce(async () => {
          return null;
        });
      const databaseFindOneMock = jest
        .spyOn(cardService['databaseService'], 'findOne')
        .mockImplementationOnce(async () => {
          return expectedResult;
        });
      const cachePutMock = jest
        .spyOn(cardService['cacheService'], 'put')
        .mockImplementationOnce(async () => {
          return;
        });

      // act
      const result = await cardService.getCard(faker.hacker.noun());

      // assert
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
      expect(cacheGetMock).toHaveBeenCalled();
      expect(databaseFindOneMock).toHaveBeenCalled();
      expect(cachePutMock).toHaveBeenCalled();
    });

    test('getCard_CardFoundInCache_ReturnCardDocument', async () => {
      // arrange
      const expectedResult = new GrogCard<any>(
        faker.hacker.phrase(),
        DataSource.Scryfall,
        faker.datatype.json()
      );
      const cacheGetMock = jest
        .spyOn(cardService['cacheService'], 'get')
        .mockImplementationOnce(async () => {
          return expectedResult;
        });

      // act
      const result = await cardService.getCard(faker.hacker.noun());

      // assert
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
      expect(cacheGetMock).toHaveBeenCalled();
    });
  });
});
