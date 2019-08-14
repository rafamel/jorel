import { defaults as options } from '~/options';
import { PROTECTED } from './constants';
import { Collection } from '~/collection';

export function error(collection: typeof Collection, msg: string): never {
  throw Error(`Collection ${collection.collection || collection.name} ${msg}`);
}

export default function prepare(collection: typeof Collection): void {
  // Safety checks: initial guarantees
  if (options.sanity) {
    if (!collection.collection) {
      return error(collection, 'has no collection field');
    }
    if (!collection.id) return error(collection, 'has no id');
    if (!collection.adapter) return error(collection, 'has no adapter');
    if (!collection.properties) {
      if (!collection.schema) {
        return error(collection, 'has properties definition and no schema');
      }
      if (!collection.schema.properties) {
        return error(
          collection,
          'has no properties definition and no schema properties'
        );
      }
    }
  }

  // Set properties
  const properties = (
    collection.properties || Object.keys(collection.schema.properties || {})
  ).concat();
  if (!properties.includes(collection.id)) properties.push(collection.id);
  collection.properties = properties;

  // Sanity checks: protected properties
  if (options.sanity) {
    // Verify no protected properties exist on the schema
    const propUnion = PROTECTED.filter((x) =>
      collection.properties.includes(x)
    );
    if (propUnion.length) {
      return error(
        collection,
        `can't have any protected instance property: ${PROTECTED.join(', ')}`
      );
    }

    // TODO verify edges schema (ajv)
    // Verify no protected fields exist on edges
    if (collection.edges) {
      const oneKeys = Object.keys(collection.edges.one || {});
      const manyKeys = Object.keys(collection.edges.many || {});
      const edgeUnion = oneKeys
        .concat(manyKeys)
        .filter((x) => PROTECTED.includes(x));
      if (edgeUnion.length) {
        return error(
          collection,
          `can't have any protected property as an edge: ${PROTECTED.join(
            ', '
          )}`
        );
      }
      // Verify one and many edges don't overlap
      const edgesOverlap = oneKeys.filter((x) => manyKeys.includes(x));
      if (edgesOverlap.length) {
        return error(
          collection,
          `can't have several edges with the same property name`
        );
      }

      // Verify edges don't overlap with own properties
      const propEdgeOverlap = oneKeys
        .concat(manyKeys)
        .filter((x) => properties.includes(x));
      if (propEdgeOverlap.length) {
        return error(
          collection,
          `can't have edges with the same property name as some of its stored data properties`
        );
      }
    }
  }

  // TODO validate edges schema
  // TODO: seal constructor
}
