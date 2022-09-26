import * as Scry from 'scryfall-sdk';
import * as JSONStream from 'JSONStream';
import { container, singleton } from 'tsyringe';
import { Card } from 'scryfall-sdk';
import { BaseService } from '../../common/baseService';
import { DatabaseService } from '../../database/databaseService';
import { CardDocument } from '../../database/model/cardDocument';

@singleton()
export class CardService extends BaseService {
  private databaseService!: DatabaseService;

  public constructor() {
    super(__filename);
    this.databaseService = container.resolve(DatabaseService);
  }

  public async getCard(cardName: string): Promise<CardDocument<Card>> {
    try {
      return await this.databaseService.findOne({
        'data.name': cardName,
      });
    } catch (error) {
      this.logger.error('Failed to get Card.', {
        cardName,
        error,
      });
      throw error;
    }
  }

  // TODO: move this method into a different class outside of the API
  public async downloadAllCards(): Promise<void> {
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
