import { JSONSchema7 } from 'json-schema';

export interface IOptions {
  /**
   * Controls whether safety checks are run.
   */
  sanity: boolean;
}

export interface IModelOptions {
  loader: boolean;
  validate: boolean;
  prefetch: boolean;
  // TODO
  resolver: any;
  name: string | null;
  id: string | null;
  properties: string[];
  schema: JSONSchema7;
}
