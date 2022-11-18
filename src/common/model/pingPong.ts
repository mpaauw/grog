export class PingPong {
  public initialized!: boolean;

  public dateCreated?: Date;

  public dateLastModified?: Date;

  public constructor(
    initialized = false,
    dateCreated = new Date(),
    dateLastModified?: Date,
  ) {
    this.initialized = initialized;
    this.dateCreated = dateCreated;
    this.dateLastModified = dateLastModified || dateCreated;
  }
}
