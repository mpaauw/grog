/* eslint-disable no-promise-executor-return */

export class Stopwatch {
  public static async sleep(sleepTimeInMilliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, sleepTimeInMilliseconds));
  }
}
