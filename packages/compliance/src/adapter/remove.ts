import { TAdapter } from '@jorel/orm';

export default function testRemove(adapter: TAdapter<any>): void {
  const users = adapter('users', 'id');

  test(`Removes all`, async () => {
    const data = [
      { name: 'foo', email: 'foo@foo' },
      { name: 'bar', email: 'bar@bar' },
      { name: 'baz', email: 'baz@baz' }
    ];

    await users.batch({ select: [], data });
    let all = await users.query();
    expect(all).not.toBe(undefined);
    expect(all && all.length).toBeGreaterThan(2);

    const res = await users.remove();
    expect(res).toBe(undefined);
    all = await users.query();
    expect(all).toHaveLength(0);

    await users.batch({ select: [], data });
    all = await users.query();
    expect(all).toHaveLength(3);

    await users.remove({ where: {} });
    all = await users.builder;
    expect(all).toHaveLength(0);
  });

  test(`Removes selectively`, async () => {
    const data = [
      { name: 'foo', email: 'foo@foo' },
      { name: 'bar', email: 'bar@bar' },
      { name: 'baz', email: 'baz@baz' }
    ];

    await users.batch({ select: [], data });
    let all = await users.query();
    expect(all).toHaveLength(3);

    await users.remove({
      where: {
        email: { $gte: 'baz@baz' }
      }
    });

    all = await users.query();
    expect(all).toHaveLength(1);
    expect(all && all[0]).toHaveProperty('name', 'bar');
  });
}
