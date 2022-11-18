import { singleton } from 'tsyringe';
import { Client } from 'redis-om';
import { createClient } from 'redis';
import { BaseService } from '../common/baseService';

@singleton()
export class CacheService extends BaseService {
  private cacheClient!: Client;

  private defaultTtl!: number;

  public constructor() {
    super(__filename);
    this.cacheClient = new Client();
    this.defaultTtl = parseInt(process.env.REDIS_DEFAULT_TTL_SECONDS, 10);
  }

  public async init(): Promise<void> {
    try {
      const redis = createClient({
        url: process.env.REDIS_URL,
      });

      await redis.connect();

      this.cacheClient = await new Client().use(redis);
      this.logger.info('Successfully initialized Cache Service.');
    } catch (error) {
      this.logger.error('Failed to initialize Cache Service.', {
        url: process.env.REDIS_URL,
        error,
      });
      throw error;
    }
  }

  public async get<T>(key: string): Promise<T> {
    try {
      const value = await this.cacheClient.get(key);
      const deserializedValue = await JSON.parse(value);
      return deserializedValue;
    } catch (error) {
      this.logger.error('Failed to get entry value from Cache.', {
        key,
        error,
      });
      throw error;
    }
  }

  public async put<T>(
    key: string,
    value: T,
    ttlSeconds: number = this.defaultTtl,
  ): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.cacheClient.set(key, serializedValue);
      await this.cacheClient.expire(key, ttlSeconds);
    } catch (error) {
      this.logger.error('Failed to put entry key-value pair into Cache.', {
        key,
        value,
        ttlSeconds,
        error,
      });
      throw error;
    }
  }
}
