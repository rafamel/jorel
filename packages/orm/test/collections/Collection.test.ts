import create from '../db/create-collection';
import { JorelError } from '../../src';
import { PROTECTED } from '../../src/collections/constants';

describe(`initialize`, () => {
  test(`doesn't throw`, () => {
    expect(() => create().initialize()).not.toThrow();
  });
  test(`throws if already initialized`, () => {
    const User = create();
    expect(() => User.initialize()).not.toThrow();
    expect(() => User.initialize()).toThrowError(JorelError);
  });
  test(`throws if parent already initialized`, () => {
    const User = create();
    class User2 extends User {}
    expect(() => User.initialize()).not.toThrow();
    expect(() => User2.initialize()).toThrowError(JorelError);
  });
  test(`doesn't throw for non initialized children`, () => {
    const User = create();
    class User2 extends User {}
    class User3 extends User {}
    expect(() => User2.initialize()).not.toThrow();
    expect(() => User3.initialize()).not.toThrow();
  });
  test(`throws wo/ collection`, () => {
    const User = create();
    User.collection = undefined as any;
    expect(() => User.initialize()).toThrowError(JorelError);
  });
  test(`throws wo/ id`, () => {
    const User = create();
    User.id = undefined as any;
    expect(() => User.initialize()).toThrowError(JorelError);
  });
  test(`throws wo/ adapter`, () => {
    const User = create();
    User.adapter = undefined as any;
    expect(() => User.initialize()).toThrowError(JorelError);
  });
  test(`throws wo/ schema & properties`, () => {
    const User = create();
    User.schema = undefined as any;
    expect(() => User.initialize()).toThrowError(JorelError);
  });
  test(`throws wo/ schema properties & properties`, () => {
    const User = create();
    User.schema = { properties: undefined };
    expect(() => User.initialize()).toThrowError(JorelError);
  });
  test(`doesn't throw wo/ schema w/ properties`, () => {
    const User = create();
    User.schema = undefined as any;
    User.properties = ['name', 'email'];
    expect(() => User.initialize()).not.toThrow();
  });
  test(`doesn't throw wo/ schema properties w/ properties`, () => {
    const User = create();
    User.schema = { properties: undefined };
    User.properties = ['name', 'email'];
    expect(() => User.initialize()).not.toThrow();
  });
  test(`throws for protected properties w/ schema properties`, () => {
    PROTECTED.forEach((key) => {
      const User = create();
      User.schema = { properties: { [key]: { type: 'string' } } };
      expect(() => User.initialize()).toThrowError(JorelError);
    });
  });
  test(`throws for protected properties w/ properties`, () => {
    PROTECTED.forEach((key) => {
      const User = create();
      User.properties = [key];
      expect(() => User.initialize()).toThrowError(JorelError);
    });
  });
  test(`prioritizes explicit properties definition over schema inference`, () => {
    const User = create();
    User.properties = ['foo', 'bar'];
    expect(() => User.initialize()).not.toThrow();
    expect(User.properties.sort()).toEqual(['id', 'foo', 'bar'].sort());
  });
  test(`sets properties from schema`, () => {
    const User = create();
    expect(() => User.initialize()).not.toThrow();
    expect(User.properties.sort()).toEqual(['id', 'name', 'email'].sort());
  });
});
describe(`unitialized methods`, () => {
  test(`throws for pure()`, () => {
    const User = create();
    expect(() => User.pure()).toThrowError(JorelError);
  });
});
