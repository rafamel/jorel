import _hash from 'object-hash';

const options = {
  algorithm: 'sha1',
  respectType: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false
};

export const none = hash({});

export default function hash(obj: any): string {
  return _hash(obj, options);
}
