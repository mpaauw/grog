import { container, singleton } from 'tsyringe';
import { Card } from 'scryfall-sdk';
import { DocumentNotFoundError } from 'ottoman';
import * as Scry from 'scryfall-sdk';
import * as JSONStream from 'JSONStream';
import { BaseService } from '../../common/baseService';
import { DatabaseService } from '../../database/databaseService';
import { CacheService } from '../../cache/cacheService';
import { ImageUtil } from '../../util/imageUtil';
import { GrogData } from '../../common/model/grogData';
import { GrogDataSchema } from '../../database/schema/grogData.schema';
import { PingPong } from '../../common/model/pingPong';
import { DataSource } from '../../common/model/dataSource';
import { CARD_DOCUMENT_VERSION, PINGPONG_VERSION } from '../../common/constant';

@singleton()
export class CardService extends BaseService {
  private databaseService!: DatabaseService<GrogData<any>, GrogData<any>>;

  private cacheService!: CacheService;

  public constructor() {
    super(__filename);
    this.databaseService = container.resolve(
      DatabaseService<GrogData<any>, GrogData<any>>,
    );
    this.databaseService.registerModel('grogData', GrogDataSchema);
    this.cacheService = container.resolve(CacheService);
  }

  public async getCard(cardName: string): Promise<GrogData<Card>> {
    try {
      const cacheResult = await this.cacheService.get<GrogData<Card>>(cardName);
      if (cacheResult != null) {
        return cacheResult;
      }
      this.logger.warn(
        'Encountered cache miss; retrieving Card data from Database.',
        {
          cardName,
        },
      );

      await this.ping();

      const databaseResult = await this.databaseService.findOne({
        'data.name': cardName,
      });
      await this.cacheService.put(cardName, databaseResult);
      return databaseResult;
    } catch (error) {
      this.logger.error('Failed to get Card.', {
        cardName,
        error,
      });
      throw error;
    }
  }

  public async getCardFromImage(imageSource: string): Promise<GrogData<Card>> {
    try {
      const cardName = await ImageUtil.getCardNameTextFromImage(imageSource);
      return await this.getCard(cardName);
    } catch (error) {
      this.logger.error('Failed to get Card from image.', {
        error,
      });
      throw error;
    }
  }

  private async ping(): Promise<void> {
    try {
      const pingPongResult = await this.databaseService.findOne({
        version: PINGPONG_VERSION,
      });

      if (!pingPongResult.data.pingpong.initialized) {
        this.logger.warn('PingPong? Database not populated. Working now...', {
          result: pingPongResult,
        });

        await this.downloadAllCards();

        await this.databaseService.save(
          new GrogData(PINGPONG_VERSION, DataSource.Undefined, {
            pingpong: new PingPong(
              true,
              pingPongResult.data.pingpong.dateCreated,
              new Date(),
            ),
          }),
        );
      }
    } catch (error) {
      if (error instanceof DocumentNotFoundError) {
        this.logger.warn('$$$$$ No result found, create new document...');

        const dateCreated = new Date();

        await this.databaseService.save(
          new GrogData(PINGPONG_VERSION, DataSource.Undefined, {
            pingpong: new PingPong(false, dateCreated, new Date()),
          }),
        );

        await this.downloadAllCards();

        await this.databaseService.save(
          new GrogData(PINGPONG_VERSION, DataSource.Undefined, {
            pingpong: new PingPong(true, dateCreated, new Date()),
          }),
        );
      } else {
        this.logger.error('Failed to ping database.', {
          error,
        });
        throw error;
      }
    }
  }

  private async downloadAllCards(): Promise<void> {
    try {
      this.logger.debug('Attempting to download all card data...');

      const bulkDataStream = await Scry.BulkData.downloadByType(
        'default_cards',
        0,
      );
      if (!bulkDataStream) {
        throw new Error('Failed to download bulk data stream from Scryfall.');
      }

      await bulkDataStream
        .pipe(await JSONStream.parse('*'))
        .on('data', async (data) => {
          await this.databaseService.save(
            new GrogData(CARD_DOCUMENT_VERSION, DataSource.Scryfall, data),
          );
        });

      this.logger.debug('All card data downloaded, database populated.');
    } catch (error) {
      this.logger.error('Failed to download all Cards.', {
        error,
      });
      throw error;
    }
  }
}
