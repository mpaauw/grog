import 'reflect-metadata';
import { container } from 'tsyringe';
import { ApiServer } from './api/server/apiServer';
import { DatabaseService } from './database/databaseService';

require('dotenv').config();

const databaseService = container.resolve(DatabaseService);
const apiServer: ApiServer = container.resolve(ApiServer);

(async () => {
  await databaseService.init();
  apiServer.run();
})();
