import { ErrorObject } from 'ajv';

export enum EErrorTypes {
  CollectionValidation = 'CollectionValidation',
  QueryValidation = 'QueryValidation',
  MutationValidation = 'MutationValidation'
}

export interface IJorelError {
  message: string;
  type: EErrorTypes;
  /**
   * Array of validation errors, if any, as [*Ajv*](https://github.com/epoberezkin/ajv) `ErrorObject`s.
   */
  errors?: ErrorObject[];
}

export class JorelError extends Error implements IJorelError {
  /** See `IJorelEror.type` */
  public type: EErrorTypes;
  /** See `IJorelEror.errors` */
  public errors?: ErrorObject[];
  public constructor(options: IJorelError) {
    super(options.message);
    Object.assign(this, options);
  }
}
