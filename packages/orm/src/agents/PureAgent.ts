import { JorelError, EErrorTypes } from '../errors';

export type TPureAgentTypes<T, R> =
  | (() => R & Promise<T[] | void>)
  | (() => R & Promise<T | void>);

export default class PureAgent<T, R> {
  public exec: TPureAgentTypes<T, R>;
  public constructor(fn: TPureAgentTypes<T, R>) {
    this.exec = fn;
  }
  /**
   * For any query, ensures there is exactly one result and returns it as an object; throws otherwise.
   */
  public one(): PureAgent<T, Promise<T>> {
    return new PureAgent(async () => {
      let res = await this.exec();
      if (Array.isArray(res)) {
        if (res.length !== 1) {
          throw new JorelError({
            message: `Expected one element in response; found ${res.length}`,
            type: EErrorTypes.QueryValidation
          });
        }
        res = res[0];
      }
      if (!res) {
        throw new JorelError({
          message: `Expected one element in response; found 0`,
          type: EErrorTypes.QueryValidation
        });
      }

      return res;
    });
  }
  /**
   * For any querie, ensures there is at least one result, or exactly `n` results if `n` is passed, and returns them as an object array; throws otherwise.
   */
  public some(n?: number): PureAgent<T, Promise<T[]>> {
    return new PureAgent(async () => {
      let res = await this.exec();
      if (!Array.isArray(res)) res = res ? [res] : [];
      if (n ? res.length !== n : res.length === 0) {
        throw new JorelError({
          message: `Expected ${n || 'some'} elements in response; found ${
            res.length
          }`,
          type: EErrorTypes.QueryValidation
        });
      }
      return res;
    });
  }
}
