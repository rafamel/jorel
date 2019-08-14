import { ErrorObject } from 'ajv';

export default class QueryError extends Error {
  static types = {
    QueryError: 'Query error',
    RequestError: 'Query request was malformed',
    ResponseError: `Unexpected query response`,
    ExecutionError: 'Query execution error',
    ValidationError: `Mutation data didn't match schema`,
    EarlyFailError: `Another error caused an early fail`
  };
  /**
   * Error type string identifier
   */
  public type: keyof (typeof QueryError.types);
  /**
   * `QueryError`s can be chained. `QueryError.first` references the first query error that arised in a chain, which will probably be the most specific and helpful.
   */
  public first: QueryError;
  public child?: Error;
  public path?: string[];
  /**
   * Additional error information message
   */
  public info?: string;
  /**
   * Array of validation errors, if any, as [*Ajv*](https://github.com/epoberezkin/ajv) `ErrorObject`s.
   */
  public validation?: ErrorObject[];
  constructor(
    type: keyof (typeof QueryError.types),
    opts: {
      path?: string[];
      info?: string;
      err?: Error;
      validation?: ErrorObject[];
    } = {}
  ) {
    if (!QueryError.types.hasOwnProperty(type)) type = 'QueryError';
    super(QueryError.types[type]);
    this.type = type;

    this.path = opts.path;
    this.info = opts.info;
    this.validation = opts.validation;
    this.child = opts.err;
    this.first = this.child instanceof QueryError ? this.child.first : this;
  }
}
