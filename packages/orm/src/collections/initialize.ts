import Collection from './Collection';
import { JorelError, EErrorTypes } from '~/errors';
import { INITIALIZED, PROTECTED } from './constants';
import PureCollection from './PureCollection';
import registry from '../registry';
import { defaults as options } from '../options';

export function error<T extends typeof Collection>(
  this: T,
  msg: string
): never {
  throw new JorelError({
    message: `Collection ${this.collection || this.name} ${msg}`,
    type: EErrorTypes.CollectionValidation
  });
}

export function uninitialized<T extends typeof Collection>(this: T): never {
  return error.call(
    this,
    'has not been initialized. Call Collection.initialize() before calling other collection methods'
  );
}

export default function initialize<T extends typeof Collection>(this: T): T {
  // Safety checks: initial guarantees
  if (options.sanity) {
    if (!this.collection) return error.call(this, 'has no collection field');
    if (!this.id) return error.call(this, 'has no id');
    if (!this.adapter) return error.call(this, 'has no adapter');
    if (!this.properties) {
      if (!this.schema)
        return error.call(this, 'has properties definition and no schema');
      if (!this.schema.properties) {
        return error.call(
          this,
          'has no properties definition and no schema properties'
        );
      }
    }
    // Verify it hasn't been initialized yet
    if ((this as any)[INITIALIZED]) {
      return error.call(
        this,
        `got Collection.initialize() called more than one. A collection can't be initialized twice or extend any other non-abstract collection initialize() might get called on.`
      );
    }
  }

  // Set properties
  const properties = (
    this.properties || Object.keys(this.schema.properties || {})
  ).concat();
  if (!properties.includes(this.id)) properties.push(this.id);
  this.properties = properties;

  // Sanity checks: protected properties
  if (options.sanity) {
    // Verify no protected properties exist on the schema
    const union = PROTECTED.filter((x) => this.properties.includes(x));
    if (union.length) {
      return error.call(
        this,
        `can't have any protected instance property: ${PROTECTED.join(', ')}`
      );
    }
  }

  // Set properties
  (this as any)[INITIALIZED] = true;
  this.pure = () => new PureCollection(this) as any;

  // Register and return
  return registry.set(this);
}
