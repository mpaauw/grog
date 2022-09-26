import 'reflect-metadata';
import { container } from 'tsyringe';
import { ApiServer } from './api/server/apiServer';
import { CacheService } from './cache/cacheService';
import { DatabaseService } from './database/databaseService';

require('dotenv').config();

const databaseService = container.resolve(DatabaseService);
const cacheService = container.resolve(CacheService);
const apiServer: ApiServer = container.resolve(ApiServer);

(async () => {
  await databaseService.init();
  await cacheService.init();
  apiServer.run();
})();
