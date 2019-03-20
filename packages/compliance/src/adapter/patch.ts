import { TAdapter } from '@jorel/orm';

export default function testRemove(adapter: TAdapter<any>): void {
  const users = adapter('users', 'id');
  const reset = async (): Promise<void> => {
    const data = [
      { name: 'foo', email: 'foo@foo' },
      { name: 'bar', email: 'bar@bar' },
      { name: 'baz', email: 'baz@baz' }
    ];
    await users.remove();
    await users.batch({ data });
  };

  test(`Patches all`, async () => {
    await reset();

    await users.patch({
      select: [],
      data: { name: 'patch', email: 'patch@patch' }
    });

    const all = (await users.query()) as any[];

    expect(all).toHaveLength(3);
    expect(all.map((x) => x.name)).toEqual(Array(3).fill('patch'));
    expect(all.map((x) => x.email)).toEqual(Array(3).fill('patch@patch'));
  });
  test(`Patches all; returns all on select = null`, async () => {
    await reset();

    const res1 = (await users.patch({
      data: { email: 'bar@bar' }
    })) as any[];
    const res2 = (await users.patch({
      select: null,
      data: { email: 'baz@baz' }
    })) as any[];

    expect(res1).toHaveLength(3);
    expect(res2).toHaveLength(3);
    expect(res1.map((x) => x.email)).toEqual(Array(3).fill('bar@bar'));
    expect(res2.map((x) => x.email)).toEqual(Array(3).fill('baz@baz'));
  });
  test(`Patches all; returns id for select = ['id']`, async () => {
    await reset();

    const all = (await users.query()) as any[];
    const ids = all.map((x) => x.id).sort();

    const res = (await users.patch({
      select: ['id'],
      data: { email: 'foo@foo' }
    })) as any[];

    expect(all).toHaveLength(3);
    expect(res).toHaveLength(3);
    expect(res.map((x) => x.id).sort()).toEqual(ids);

    const after = (await users.query()) as any[];

    expect(after.map((x) => x.email)).toEqual(Array(3).fill('foo@foo'));
  });
  test(`Patches all; returns id & name for select = ['id', 'name']`, async () => {
    await reset();

    const all = (await users.query()) as any[];
    const ids = all.map((x) => x.id).sort();
    const names = all.map((x) => x.name).sort();

    const res = (await users.patch({
      select: ['id', 'name'],
      data: { email: 'bar@bar' }
    })) as any[];

    expect(res).toHaveLength(3);
    expect(res.map((x) => x.id).sort()).toEqual(ids);
    expect(res.map((x) => x.name).sort()).toEqual(names);
    expect(res.map((x) => x.email).sort()).toEqual(Array(3).fill(undefined));

    const after = (await users.query()) as any[];
    expect(after.map((x) => x.email)).toEqual(Array(3).fill('bar@bar'));
  });
  test(`Patches all; returns name & email for select = ['name', 'email']`, async () => {
    await reset();

    const res = (await users.patch({
      select: ['name', 'email'],
      data: { email: 'bar@bar' }
    })) as any[];

    expect(res).toHaveLength(3);
    expect(res.map((x) => x.id).sort()).toEqual(Array(3).fill(undefined));
    expect(res.map((x) => x.name).sort()).toEqual(['foo', 'bar', 'baz'].sort());
    expect(res.map((x) => x.email).sort()).toEqual(Array(3).fill('bar@bar'));

    const after = (await users.query()) as any[];
    expect(after.map((x) => x.email)).toEqual(Array(3).fill('bar@bar'));
  });
  test(`Patches all; selects none on select = []`, async () => {
    await reset();

    const res = (await users.patch({
      select: [],
      data: { email: 'bar@bar' }
    })) as any[];

    expect(res).toBe(undefined);

    const after = (await users.query()) as any[];
    expect(after.map((x) => x.email)).toEqual(Array(3).fill('bar@bar'));
  });
  test(`Patches on where and selects all`, async () => {
    await reset();

    const res = (await users.patch({
      where: { name: { $in: ['foo', 'bar'] } },
      data: { name: 'foobar' }
    })) as any[];

    expect(res).toHaveLength(2);
    expect(res.map((x) => x.id)).not.toEqual(Array(2).fill(undefined));
    expect(res.map((x) => x.name)).toEqual(Array(2).fill('foobar'));
    expect(res.map((x) => x.email).sort()).toEqual(
      ['foo@foo', 'bar@bar'].sort()
    );

    const after = (await users.query()) as any[];
    expect(after.map((x) => x.name).sort()).toEqual(
      ['foobar', 'foobar', 'baz'].sort()
    );
  });
  test(`Patches on where and select = ['name']`, async () => {
    await reset();

    const res = (await users.patch({
      select: ['id'],
      where: { name: { $in: ['foo', 'bar'] } },
      data: { name: 'foobar' }
    })) as any[];

    expect(res).toHaveLength(2);
    expect(res.map((x) => x.id)).not.toEqual(Array(2).fill(undefined));
    expect(res.map((x) => x.name)).toEqual(Array(2).fill(undefined));
    expect(res.map((x) => x.email)).toEqual(Array(2).fill(undefined));

    const after = (await users.query()) as any[];
    expect(after.map((x) => x.name).sort()).toEqual(
      ['foobar', 'foobar', 'baz'].sort()
    );
  });
  test(`Patches on where and select = ['name']`, async () => {
    await reset();

    const res = (await users.patch({
      select: ['name'],
      where: { name: { $in: ['foo', 'bar'] } },
      data: { name: 'foobar' }
    })) as any[];

    expect(res).toHaveLength(2);
    expect(res.map((x) => x.id)).toEqual(Array(2).fill(undefined));
    expect(res.map((x) => x.name)).toEqual(Array(2).fill('foobar'));
    expect(res.map((x) => x.email)).toEqual(Array(2).fill(undefined));

    const after = (await users.query()) as any[];
    expect(after.map((x) => x.name).sort()).toEqual(
      ['foobar', 'foobar', 'baz'].sort()
    );
  });
  test(`Patches on where and select = ['name', 'id']`, async () => {
    await reset();

    const res = (await users.patch({
      select: ['name', 'id'],
      where: { name: { $in: ['foo', 'bar'] } },
      data: { name: 'foobar' }
    })) as any[];

    expect(res).toHaveLength(2);
    expect(res.map((x) => x.id)).not.toEqual(Array(2).fill(undefined));
    expect(res.map((x) => x.name)).toEqual(Array(2).fill('foobar'));
    expect(res.map((x) => x.email)).toEqual(Array(2).fill(undefined));

    const after = (await users.query()) as any[];
    expect(after.map((x) => x.name).sort()).toEqual(
      ['foobar', 'foobar', 'baz'].sort()
    );
  });
}
