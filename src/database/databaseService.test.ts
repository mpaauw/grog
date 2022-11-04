import { IModel, Ottoman } from 'ottoman';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { faker } from '@faker-js/faker';
import { DatabaseService } from './databaseService';

describe('databaseService_Tests_', () => {
  let databaseService!: DatabaseService<any, any>;

  beforeEach(() => {
    databaseService = container.resolve(DatabaseService);
  });

  describe('init_Tests_', () => {
    test('init_CatchError_ThrowError', async () => {
      // arrange
      jest
        .spyOn(databaseService['ottoman'], 'connect')
        .mockImplementationOnce(async () => {
          throw new Error();
        });

      // act / assert
      expect(async () => {
        await databaseService.init();
      }).rejects.toThrowError();
    });

    test('init_Success_Return', async () => {
      // arrange
      const ottomanConnectMock = jest
        .spyOn(databaseService['ottoman'], 'connect')
        .mockImplementationOnce(async () => {
          return new Ottoman();
        });
      const ottomanStartMock = jest
        .spyOn(databaseService['ottoman'], 'start')
        .mockImplementationOnce(async () => {
          return;
        });

      // act
      await databaseService.init();

      // assert
      expect(ottomanConnectMock).toHaveBeenCalled();
      expect(ottomanStartMock).toHaveBeenCalled();
    });
  });

  describe('save_Tests_', () => {
    test('save_CatchError_ThrowError', async () => {
      // arrange
      databaseService['documentModel'] = null;

      // act / assert
      expect(async () => {
        await databaseService.save(faker.datatype.json());
      }).rejects.toThrowError();
    });

    test('save_Success_Return', async () => {
      // arrange
      databaseService['dataModel'] = {
        fromData: () => {},
      } as any;
      const dataModelFromDataMock = jest
        .spyOn(databaseService['dataModel'] as any, 'fromData')
        .mockImplementationOnce(() => {
          return {
            save: async () => {},
          } as any;
        });

      // act
      await databaseService.save(faker.datatype.json());

      // assert
      expect(dataModelFromDataMock).toHaveBeenCalled();
    });
  });

  describe('find_Tests_', () => {
    test('find_CatchError_ThrowError', async () => {
      // arrange
      databaseService['dataModel'] = {
        find: () => {},
      } as any;
      jest
        .spyOn(databaseService['dataModel'] as any, 'find')
        .mockImplementationOnce(async () => {
          throw new Error();
        });

      // act / assert
      expect(async () => {
        await databaseService.find();
      }).rejects.toThrowError();
    });

    test('find_SuccessWithFilterAndOptions_Return', async () => {
      // arrange
      const expectedResponse = faker.datatype.json();
      databaseService['dataModel'] = {
        find: () => {},
      } as any;
      const dataModelFindMock = jest
        .spyOn(databaseService['dataModel'] as any, 'find')
        .mockImplementationOnce(async () => {
          return expectedResponse;
        });

      // act
      const result = await databaseService.find(
        faker.datatype.json(),
        faker.datatype.json()
      );

      // assert
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(dataModelFindMock).toHaveBeenCalled();
    });
  });

  describe('findOne_Tests_', () => {});
});
