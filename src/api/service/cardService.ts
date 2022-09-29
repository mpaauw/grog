import * as Scry from 'scryfall-sdk';
import * as JSONStream from 'JSONStream';
import { container, singleton } from 'tsyringe';
import { Card } from 'scryfall-sdk';
import { BaseService } from '../../common/baseService';
import { DatabaseService } from '../../database/databaseService';
import { CardDocument } from '../../database/model/cardDocument';
import { CacheService } from '../../cache/cacheService';
import { ImageHelper } from '../../util/imageHelper';

@singleton()
export class CardService extends BaseService {
  private databaseService!: DatabaseService;

  private cacheService!: CacheService;

  public constructor() {
    super(__filename);
    this.databaseService = container.resolve(DatabaseService);
    this.cacheService = container.resolve(CacheService);
  }

  public async getCard(cardName: string): Promise<CardDocument<Card>> {
    try {
      const cacheResult = await this.cacheService.get<CardDocument<Card>>(
        cardName,
      );
      if (cacheResult != null) {
        return cacheResult;
      }
      this.logger.warn(
        'Encountered cache miss; retrieving Card data from Database.',
        {
          cardName,
        },
      );
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

  public async getCardFromImage(
    imageSource: string,
  ): Promise<CardDocument<Card>> {
    try {
      const cardName = await ImageHelper.getCardNameTextFromImage(imageSource);
      return await this.getCard(cardName);
    } catch (error) {
      this.logger.error('Failed to get Card from image.', {
        error,
      });
      throw error;
    }
  }

  // TODO: move this method into a different class outside of the API
  private async downloadAllCards(): Promise<void> {
    try {
      await this.databaseService.init();

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
          await this.databaseService.save(data);
        });
    } catch (error) {
      this.logger.error('Failed to download all Cards.', {
        error,
      });
      throw error;
    }
  }
}
