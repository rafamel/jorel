import { TAdapter } from '@jorel/orm';

export default function testCreate(adapter: TAdapter<any>): void {
  const users = adapter('users', 'id');

  test(`Creates; returns all on select = null`, async () => {
    const user1 = await users.create({
      data: { name: 'foo', email: 'foo@foo' }
    });
    const user2 = await users.create({
      select: null,
      data: { name: 'bar', email: 'bar@bar' }
    });

    const arr = [user1, user2];
    expect(arr).not.toEqual([undefined, undefined]);
    expect(arr.map((x) => x && x.id).filter(Boolean)).toHaveLength(2);
    expect(arr.map((x) => x && x.name).sort()).toEqual(['foo', 'bar'].sort());
    expect(arr.map((x) => x && x.email).sort()).toEqual(
      ['foo@foo', 'bar@bar'].sort()
    );
  });
  test(`Creates; returns none for select = []`, async () => {
    const user = await users.create({ select: [], data: { name: 'foo' } });

    expect(user).toBe(undefined);
  });
  test(`Create; returns id for select = ['id']`, async () => {
    const user = await users.create({
      select: ['id'],
      data: { name: 'foo', email: 'foo@foo' }
    });

    expect(user).not.toBe(undefined);
    expect(typeof user).toBe('object');
    expect(user).toHaveProperty('id');
    expect(user).not.toHaveProperty('email');
    expect(user).not.toHaveProperty('name');
  });
  test(`Create; returns id & name for select = ['id', 'name']`, async () => {
    const user = await users.create({
      select: ['id', 'name'],
      data: { name: 'foo', email: 'foo@foo' }
    });

    expect(user).not.toBe(undefined);
    expect(typeof user).toBe('object');
    expect(user).not.toHaveProperty('email');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name', 'foo');
  });
}
