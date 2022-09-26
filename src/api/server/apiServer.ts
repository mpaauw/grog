import express, { Express } from 'express';
import { singleton } from 'tsyringe';
import { BaseService } from '../../common/baseService';
import { RegisterRoutes } from '../routes/routes';

@singleton()
export class ApiServer extends BaseService {
  private express!: Express;

  private port!: number;

  public constructor() {
    super(__filename);
    this.port = parseInt(process.env.API_SERVER_PORT, 10)
      ? parseInt(process.env.API_SERVER_PORT, 10)
      : 3000;
    this.setup();
  }

  private setup(): void {
    try {
      this.express = express();
      RegisterRoutes(this.express);
    } catch (error) {
      this.logger.error('Failed to setup API Server.', {
        error,
      });
      throw error;
    }
  }

  public run(): void {
    try {
      this.express
        .listen(this.port, () => {
          this.logger.info(`Grog API is running on port: ${this.port}`);
        })
        .on('error', () => {
          throw new Error('API Server failed during runtime.');
        });
    } catch (error) {
      this.logger.error('Failed to run API Server.', {
        error,
      });
      throw error;
    }
  }
}
