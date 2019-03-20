import { TAdapter } from '@jorel/orm';
import testCreate from './create';
import testBatch from './batch';
import testRemove from './remove';
import testQuery from './query';
import testPatch from './patch';
import testWhere from './where';

export default function adapter(adapter: TAdapter<any>): void {
  describe(`Create operations`, () => testCreate(adapter));
  describe(`Batch operations`, () => testBatch(adapter));
  describe(`Remove operations`, () => testRemove(adapter));
  describe(`Query operations`, () => testQuery(adapter));
  describe(`Patch operations`, () => testPatch(adapter));
  describe(`Where queries`, () => testWhere(adapter));
}
