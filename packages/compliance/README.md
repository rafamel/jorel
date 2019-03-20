# @jorel/compliance

[![Version](https://img.shields.io/npm/v/@jorel/compliance.svg)](https://www.npmjs.com/package/@jorel/compliance)
[![Build Status](https://img.shields.io/travis/rafamel/jorel.svg)](https://travis-ci.org/rafamel/jorel)
[![Coverage](https://img.shields.io/coveralls/rafamel/jorel.svg)](https://coveralls.io/github/rafamel/jorel)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@jorel/compliance.svg)](https://snyk.io/test/npm/@jorel/compliance)
[![License](https://img.shields.io/github/license/rafamel/jorel.svg)](https://github.com/rafamel/jorel/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/@jorel/compliance.svg)](https://www.npmjs.com/package/@jorel/compliance)

<!-- markdownlint-disable MD036 -->
**Compliance tests for *Jorel* development.**
<!-- markdownlint-enable MD036 -->

## Install

This package serves as a group of tests for compliance when developing for *Jorel.* It shouldn't be thought of as the only source of your tests, as it is not comprehensive; it does tests for a set of basic guarantees.

Tests rely on the assumption `jest-cli` is installed and are being executed within a *Jest* set environment.

To install it on development, do: [`npm install -D jest-cli @jorel/compliance`](https://www.npmjs.com/package/@jorel/compliance)

## Adapters

For the purposes of these tests, an adapter must be able to handle the following collection with its assigned columns and data types:

* `users` collection:
  * `id`: `number | string` (id; automatically assigned)
  * `name`: `string`
  * `email`: `string | null`

To test for adapter compliance, create a test file from where to call the adapter tests, then run it with *Jest:*

`index.test.ts`:

```javascript
import { adapter as adapterCompliance } from '@jorel/compliance';

// The adapter should be able to handle a 'users' collection as described.
const myAdapter = /* ...create the adapter to test */;

// Call the compliance tests
adapterCompliance(myAdapter);
```
