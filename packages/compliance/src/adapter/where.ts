import { TAdapter } from '@jorel/orm';

export default function testWhere(adapter: TAdapter<any>): void {
  const users = adapter('users', 'id');

  describe(`Nested (logical)`, () => {
    test(`or`, async () => {
      await users.remove();

      const data = [
        { name: 'foo', email: 'foo@foo' },
        { name: 'foo', email: 'foo@foo' },
        { name: 'bar', email: 'foo@foo' },
        { name: 'baz', email: 'baz@baz' }
      ];
      await users.batch({ data });

      const arr = await users.query({
        where: {
          name: { $eq: 'foo' },
          $or: [{ name: { $eq: 'bar' } }]
        }
      });

      expect(Array.isArray(arr)).toBe(true);
      expect(arr).toHaveLength(3);
      expect(arr && arr.map((x) => x.name).sort()).toEqual(
        ['foo', 'foo', 'bar'].sort()
      );
    });
    test(`and`, async () => {
      const arr1 = await users.query({
        where: {
          name: { $eq: 'foo' },
          $and: [{ name: { $eq: 'bar' } }]
        }
      });
      const arr2 = await users.query({
        where: {
          name: { $eq: 'foo' },
          $and: [{ email: { $eq: 'foo@foo' } }]
        }
      });
      const arr3 = await users.query({
        where: {
          $and: [{ name: { $eq: 'foo' } }, { email: { $eq: 'foo@foo' } }]
        }
      });

      expect(Array.isArray(arr1)).toBe(true);
      expect(arr1).toHaveLength(0);
      [arr2, arr3].forEach((arr) => {
        expect(Array.isArray(arr)).toBe(true);
        expect(arr).toHaveLength(2);
        expect(arr && arr.map((x) => x.name).sort()).toEqual(
          ['foo', 'foo'].sort()
        );
      });
    });
    test(`and/or`, async () => {
      const arr1 = await users.query({
        where: {
          $or: [
            { name: { $eq: 'baz' } },
            {
              name: { $eq: 'foo' },
              $and: [{ email: { $eq: 'foo@foo' } }]
            }
          ]
        }
      });
      const arr2 = await users.query({
        where: {
          $or: [
            { name: { $eq: 'baz' } },
            {
              $and: [{ name: { $eq: 'foo' } }, { email: { $eq: 'foo@foo' } }]
            }
          ]
        }
      });

      [arr1, arr2].forEach((arr) => {
        expect(arr).toHaveLength(3);
        expect(arr && arr.map((x) => x.name).sort()).toEqual(
          ['baz', 'foo', 'foo'].sort()
        );
      });
    });
  });
  describe(`Operators`, () => {
    test(`$eq`, async () => {
      const arr = await users.query({ where: { name: { $eq: 'baz' } } });

      expect(arr).toHaveLength(1);
      expect(arr && arr.map((x) => x.name)).toEqual(['baz']);
    });
    test(`$ne`, async () => {
      const arr = await users.query({ where: { name: { $ne: 'foo' } } });

      expect(arr).toHaveLength(2);
      expect(arr && arr.map((x) => x.name).sort()).toEqual(
        ['bar', 'baz'].sort()
      );
    });
    test(`$gte`, async () => {
      const arr = await users.query({ where: { name: { $gte: 'baz' } } });

      expect(arr).toHaveLength(3);
      expect(arr && arr.map((x) => x.name).sort()).toEqual(
        ['baz', 'foo', 'foo'].sort()
      );
    });
    test(`$gt`, async () => {
      const arr = await users.query({ where: { name: { $gt: 'baz' } } });

      expect(arr).toHaveLength(2);
      expect(arr && arr.map((x) => x.name).sort()).toEqual(
        ['foo', 'foo'].sort()
      );
    });
    test(`$lte`, async () => {
      const arr = await users.query({ where: { name: { $lte: 'baz' } } });

      expect(arr).toHaveLength(2);
      expect(arr && arr.map((x) => x.name).sort()).toEqual(
        ['bar', 'baz'].sort()
      );
    });
    test(`$lt`, async () => {
      const arr = await users.query({ where: { name: { $lt: 'baz' } } });

      expect(arr).toHaveLength(1);
      expect(arr && arr.map((x) => x.name).sort()).toEqual(['bar'].sort());
    });
    test(`$in`, async () => {
      const arr = await users.query({
        where: { name: { $in: ['bar', 'baz'] } }
      });

      expect(arr).toHaveLength(2);
      expect(arr && arr.map((x) => x.name).sort()).toEqual(
        ['bar', 'baz'].sort()
      );
    });
    test(`$nin`, async () => {
      const arr = await users.query({
        where: { name: { $nin: ['bar', 'baz'] } }
      });

      expect(arr).toHaveLength(2);
      expect(arr && arr.map((x) => x.name).sort()).toEqual(
        ['foo', 'foo'].sort()
      );
    });
    test(`mixed: $in, $lt`, async () => {
      const arr = await users.query({
        where: { name: { $in: ['bar', 'baz'], $lt: 'baz' } }
      });

      expect(arr).toHaveLength(1);
      expect(arr && arr.map((x) => x.name).sort()).toEqual(['bar'].sort());
    });
  });
}
