import { TAdapter } from '@jorel/orm';

export default function testQuery(adapter: TAdapter<any>): void {
  const users = adapter('users', 'id');

  test(`Query all/select all`, async () => {
    await users.remove();

    const data = [
      { name: 'foo', email: 'foo@foo' },
      { name: 'bar', email: 'foo@foo' },
      { name: 'baz', email: 'baz@baz' }
    ];
    const res = await users.batch({ data });
    const arr = await users.query();

    expect(Array.isArray(arr)).toBe(true);
    expect(arr).toHaveLength(3);
    expect(arr && arr.map((x) => x.id).sort()).toEqual(
      res && res.map((x) => x.id).sort()
    );
    expect(arr && arr.map((x) => x.name).sort()).toEqual(
      ['foo', 'bar', 'baz'].sort()
    );
  });
  test(`Select some`, async () => {
    const arr = await users.query({ select: ['name', 'email'] });

    expect(arr).toHaveLength(3);
    expect(arr && arr.map((x) => x.id)).toEqual(Array(3).fill(undefined));
    expect(arr && arr.map((x) => x.name).sort()).toEqual(
      ['foo', 'bar', 'baz'].sort()
    );
    expect(arr && arr.map((x) => x.email).sort()).toEqual(
      ['foo@foo', 'foo@foo', 'baz@baz'].sort()
    );
  });
  test(`Select none`, async () => {
    const users = adapter('users', 'id');
    const arr = await users.query({ select: [] });

    expect(arr).toBe(undefined);
  });
  test(`Basic where`, async () => {
    const arr = await users.query({ where: { email: { $eq: 'foo@foo' } } });

    expect(Array.isArray(arr)).toBe(true);
    expect(arr).toHaveLength(2);
    expect(arr && arr.map((x) => x.id)).not.toEqual(Array(2).fill(undefined));
    expect(arr && arr.map((x) => x.name).sort()).toEqual(['foo', 'bar'].sort());
  });
  test(`Returns empty array for no results`, async () => {
    const arr = await users.query({ where: { email: { $eq: 'non@non' } } });

    expect(Array.isArray(arr)).toBe(true);
    expect(arr).toHaveLength(0);
  });
  test(`select and where`, async () => {
    const arr = await users.query({
      select: ['name'],
      where: { email: { $eq: 'foo@foo' } }
    });

    expect(arr).toHaveLength(2);
    expect(arr && arr.map((x) => x.id)).toEqual(Array(2).fill(undefined));
    expect(arr && arr.map((x) => x.name).sort()).toEqual(['foo', 'bar'].sort());
  });
}
