import { IOptions } from './types';

/**
 * Default options. An `IOptions` object.
 */
export const defaults: IOptions = {
  sanity: true
};

export default function options(opts: Partial<IOptions>): void {
  Object.assign(defaults, opts);
}
