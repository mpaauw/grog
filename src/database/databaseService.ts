/* eslint-disable new-cap */

import { ModelTypes, Ottoman } from 'ottoman';
import { singleton } from 'tsyringe';
import { BaseService } from '../common/baseService';
import { CARD_DOCUMENT_VERSION } from '../common/constant';
import { CardDocument } from './model/cardDocument';
import { DataSource } from './model/dataSource';

@singleton()
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
        connectionString: process.env.COUCHBASE_URL,
        bucketName: process.env.COUCHBASE_BUCKET_NAME,
        username: process.env.COUCHBASE_USERNAME,
        password: process.env.COUCHBASE_PASSWORD,
      });
      await this.ottoman.start();
      await this.instantiateModels();
      this.logger.info('Successfully initialized Database Service.');
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
        new CardDocument(CARD_DOCUMENT_VERSION, DataSource.Scryfall, data)
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

  public async find(filter?: any, options?: any): Promise<any> {
    try {
      return await this.documentModel.find(filter, options);
    } catch (error) {
      this.logger.error('Failed to find Document.', {
        filter,
        error,
      });
      throw error;
    }
  }

  public async findOne(filter?: any, options?: any): Promise<any> {
    try {
      return await this.documentModel.findOne(filter, options);
    } catch (error) {
      this.logger.error('Failed to find one Document.', {
        filter,
        error,
      });
      throw error;
    }
  }

  public async findById(documentId: string): Promise<any> {
    try {
      return await this.documentModel.findById(documentId);
    } catch (error) {
      this.logger.error('Failed to find Document by ID.', {
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
