import { backOff } from 'exponential-backoff';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { ApiServer } from './api/server/apiServer';
import { CacheService } from './cache/cacheService';
import { Service } from './common/service';
import { DatabaseService } from './database/databaseService';
import { LoggerUtil } from './util/loggerUtil';

require('dotenv').config();

const logger = LoggerUtil.createLogger(
  process.env.ENVIRONMENT === 'local' ? __filename : '',
);

const initMaxNumberOfRetries = parseInt(
  process.env.INIT_MAX_NUMBER_OF_RETRIES,
  10,
);
const initRetryBackoffIntervalMilliseconds = parseInt(
  process.env.INIT_RETRY_BACKOFF_INTERVAL_MILLISECONDS,
  10,
);

const databaseService = container.resolve(DatabaseService);
const cacheService = container.resolve(CacheService);
const apiServer: ApiServer = container.resolve(ApiServer);

(async () => {
  const services: Service[] = [databaseService, cacheService];

  const retryableServices: Promise<void>[] = [];
  services.forEach((service) => {
    const retryable = backOff(async () => service.init(), {
      delayFirstAttempt: true,
      numOfAttempts: initMaxNumberOfRetries,
      startingDelay:
        initMaxNumberOfRetries * initRetryBackoffIntervalMilliseconds,
      jitter: 'full',
      maxDelay: initMaxNumberOfRetries * initRetryBackoffIntervalMilliseconds,
      retry: (error: any, attempt: number) => {
        logger.warn('Unable to initialize service; attempting retry.', {
          service,
          currentRetryAttempt: attempt,
          maxNumberOfRetries: initMaxNumberOfRetries,
          retryBackoffInterval: initRetryBackoffIntervalMilliseconds,
          error,
        });
        return true;
      },
    });
    retryableServices.push(retryable);
  });

  await Promise.all(retryableServices);

  apiServer.run();
})();
