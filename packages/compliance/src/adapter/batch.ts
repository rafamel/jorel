import { TAdapter } from '@jorel/orm';

export default function testBatch(adapter: TAdapter<any>): void {
  const users = adapter('users', 'id');

  test(`Batch insert; returns all on select = null`, async () => {
    const res1 = await users.batch({
      data: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }]
    });
    const res2 = await users.batch({
      select: null,
      data: [
        { name: 'foo', email: 'foo@foo' },
        { name: 'bar', email: 'bar@bar' },
        { name: 'baz', email: 'baz@baz' }
      ]
    });

    [res1, res2].forEach((res: any) => {
      expect(res).not.toBe(undefined);
      expect(res).toHaveLength(3);
      expect(res.map((x: any) => x && x.id).filter(Boolean)).toHaveLength(3);
      expect(res.map((x: any) => x.name).sort()).toEqual(
        ['foo', 'bar', 'baz'].sort()
      );
    });

    // Performs correct selection
    expect(res1 && res1.map((x) => x.email).sort()).not.toEqual(
      ['foo@foo', 'bar@bar', 'baz@baz'].sort()
    );
    expect(res2 && res2.map((x) => x.email).sort()).toEqual(
      ['foo@foo', 'bar@bar', 'baz@baz'].sort()
    );
  });
  test(`Batch insert; returns none for select = []`, async () => {
    const data = [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }];
    const arr = await users.batch({ select: [], data });

    expect(arr).toBe(undefined);
  });
  test(`Batch insert; returns id for select = ['id']`, async () => {
    const data = [
      { name: 'foo', email: 'foo@foo' },
      { name: 'bar', email: 'bar@bar' },
      { name: 'baz', email: 'baz@baz' }
    ];
    const arr = await users.batch({ select: ['id'], data });

    expect(arr).not.toBe(undefined);
    expect(arr).toHaveLength(3);
    expect(arr && arr.map((x) => x.id).filter(Boolean)).toHaveLength(3);
    expect(arr && arr.map((x) => x.name)).toEqual(Array(3).fill(undefined));
    expect(arr && arr.map((x) => x.email)).toEqual(Array(3).fill(undefined));
  });
  test(`Batch insert; returns id & name for select = ['id', 'name']`, async () => {
    const data = [
      { name: 'foo', email: 'foo@foo' },
      { name: 'bar', email: 'bar@bar' },
      { name: 'baz', email: 'baz@baz' }
    ];
    const arr = await users.batch({ select: ['id', 'name'], data });

    expect(arr).not.toBe(undefined);
    expect(arr).toHaveLength(3);
    expect(arr && arr.map((x) => x.id).filter(Boolean)).toHaveLength(3);
    expect(arr && arr.map((x) => x.name).sort()).toEqual(
      ['foo', 'bar', 'baz'].sort()
    );
    expect(arr && arr.map((x) => x.email)).toEqual(Array(3).fill(undefined));
  });
}
