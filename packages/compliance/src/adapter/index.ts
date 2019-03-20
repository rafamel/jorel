import { TAdapter } from '@jorel/orm';
import testCreate from './create';

export default function adapter(adapter: TAdapter<any>): void {
  describe(`Create operations`, () => testCreate(adapter));
}
