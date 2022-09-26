import * as Scry from 'scryfall-sdk';
import * as JSONStream from 'JSONStream';
import { BaseService } from '../common/baseService';
import { DatabaseService } from '../database/databaseService';

export class CardService extends BaseService {
  private databaseService!: DatabaseService;

  public constructor() {
    super(__filename);
    this.databaseService = new DatabaseService();
  }

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
