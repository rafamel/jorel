export const INITIALIZED: unique symbol = Symbol('initialized');

export const PROTECTED: string[] = [
  'raw',
  'pure',
  'batch',
  'create',
  'update',
  'patch',
  'query',
  'subscribe',
  'on'
];
