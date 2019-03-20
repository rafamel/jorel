import { TAdapter } from '@jorel/orm';
import testCreate from './create';
import testBatch from './batch';
import testRemove from './remove';

export default function adapter(adapter: TAdapter<any>): void {
  describe(`Create operations`, () => testCreate(adapter));
  describe(`Batch operations`, () => testBatch(adapter));
  describe(`Remove operations`, () => testRemove(adapter));
}
