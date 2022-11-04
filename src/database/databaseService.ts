/* eslint-disable new-cap */

import {
  IModel, ModelOptions, Ottoman, Schema,
} from 'ottoman';
import { singleton } from 'tsyringe';
import { BaseService } from '../common/baseService';

@singleton()
export class DatabaseService<DocumentType, ReturnType> extends BaseService {
  private ottoman!: Ottoman;

  private dataModel!: IModel<DocumentType, ReturnType>;

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
      this.logger.info('Successfully initialized Database Service.');
    } catch (error) {
      this.logger.error('Failed to initialize DatabaseService.', {
        error,
      });
      throw error;
    }
  }

  public registerModel(
    modelName: string,
    modelSchema: Schema,
    modelOptions?: ModelOptions,
  ): void {
    this.dataModel = this.ottoman.model(modelName, modelSchema, modelOptions);
  }

  public async save(data: DocumentType): Promise<void> {
    try {
      const document = this.dataModel.fromData(data);
      await document.save();
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
      return await this.dataModel.find(filter, options);
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
      return await this.dataModel.findOne(filter, options);
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
      return await this.dataModel.findById(documentId);
    } catch (error) {
      this.logger.error('Failed to find Document by ID.', {
        documentId,
        error,
      });
      throw error;
    }
  }
}
