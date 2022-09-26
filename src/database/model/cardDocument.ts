import { DataSource } from './dataSource';

export class CardDocument<T> {
  public version!: string;

  public dataSource!: DataSource;

  public data!: T;

  public constructor(version?: string, dataSource?: DataSource, data?: T) {
    if (version) {
      this.version = version;
    }
    if (dataSource) {
      this.dataSource = dataSource;
    }
    if (data) {
      this.data = data;
    }
  }
}
