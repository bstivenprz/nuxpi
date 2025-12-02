export class Result {
  static async orFail<T>(
    promise: Promise<T | null | undefined>,
    error: Error,
  ): Promise<T> {
    const result = await promise;
    if (result === null || result === undefined || result === false)
      throw error;
    return result;
  }
}
