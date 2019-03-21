import { IOptions } from './types';

export const options: IOptions = {
  sanity: true
};

export default function setOptions(opts: Partial<IOptions>): void {
  Object.assign(options, opts);
}
