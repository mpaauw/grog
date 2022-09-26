/* eslint-disable new-cap */

import { ModelTypes, Ottoman } from 'ottoman';
import { BaseService } from '../common/baseService';
import { CardDocument } from '../../model/database/cardDocument';
import { CARD_DOCUMENT_VERSION } from '../../constant/database/databaseConstants';
import { DataSource } from '../../model/database/dataSource';

const {
  COUCHBASE_URL,
  COUCHBASE_BUCKET_NAME,
  COUCHBASE_USERNAME,
  COUCHBASE_PASSWORD,
} = process.env;

export class DatabaseService extends BaseService {
  private ottoman!: Ottoman;

  private documentModel!: ModelTypes<any>;

  public constructor() {
    super(__filename);
    this.ottoman = new Ottoman({
      collectionName: '_default',
    });
  }

  public async init(): Promise<void> {
    try {
      await this.ottoman.connect({
        connectionString: COUCHBASE_URL,
        bucketName: COUCHBASE_BUCKET_NAME,
        username: COUCHBASE_USERNAME,
        password: COUCHBASE_PASSWORD,
      });
      await this.ottoman.start();
      await this.instantiateModels();
    } catch (error) {
      this.logger.error('Failed to initialize DatabaseService.', {
        error,
      });
      throw error;
    }
  }

  public async save<T>(data: T): Promise<void> {
    try {
      const cardDocument = new this.documentModel(
        new CardDocument(CARD_DOCUMENT_VERSION, DataSource.Scryfall, data),
      );
      await cardDocument.save();
    } catch (error) {
      this.logger.error('Failed to save Document.', {
        data,
        error,
      });
      throw error;
    }
  }

  public async getById(documentId: string): Promise<any> {
    try {
      const result = await this.documentModel.findById(documentId);
      return result;
    } catch (error) {
      this.logger.error('Failed to get Document by ID.', {
        documentId,
        error,
      });
      throw error;
    }
  }

  private async instantiateModels(): Promise<void> {
    try {
      this.documentModel = this.ottoman.model('CardDocument', {
        version: String,
        dataSource: String,
        data: Object,
      });
    } catch (error) {
      this.logger.error('Failed to instantiate DatabaseService models.', {
        error,
      });
      throw error;
    }
  }
}
