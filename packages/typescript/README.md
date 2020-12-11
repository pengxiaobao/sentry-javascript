<p align="center">
  <a href="https://sentry.io" target="_blank" align="center">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" width="280">
  </a>
  <br />
</p>

# Sentry TypeScript Configuration

[![npm version](https://img.shields.io/npm/v/sentry-csii-internal-typescript.svg)](https://www.npmjs.com/package/sentry-csii-internal-typescript)
[![npm dm](https://img.shields.io/npm/dm/sentry-csii-internal-typescript.svg)](https://www.npmjs.com/package/sentry-csii-internal-typescript)
[![npm dt](https://img.shields.io/npm/dt/sentry-csii-internal-typescript.svg)](https://www.npmjs.com/package/sentry-csii-internal-typescript)

[![typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](http://getsentry.github.io/sentry-javascript/)

## Links

- [Official SDK Docs](https://docs.sentry.io/quickstart/)
- [TypeDoc](http://getsentry.github.io/sentry-javascript/)

## General

Shared typescript configuration used at Sentry.

## Installation

```sh
# With Yarn:
yarn add --dev sentry-csii-internal-typescript

# With NPM:
npm install --save-dev sentry-csii-internal-typescript
```

## Usage

Add the following config files to your project's root directory:

**tslint.json**:

```json
{
  "extends": "sentry-csii-internal-typescript/tslint"
}
```

**tsconfig.json**:

```json
{
  "extends": "./node_modules/sentry-csii-internal-typescript/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "rootDir": "src",
    "outDir": "dist"
  }
}
```
