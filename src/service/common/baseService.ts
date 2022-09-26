import { Logger } from 'winston';
import { LoggerUtil } from '../../util/loggerUtil';

export class BaseService {
  public logger!: Logger;

  public constructor(filename: string) {
    this.logger = LoggerUtil.createLogger(
      process.env.ENVIRONMENT === 'local' ? filename : '',
    );
  }
}
