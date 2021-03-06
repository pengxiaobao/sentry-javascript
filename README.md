<p align="center">
  <a href="https://sentry.io" target="_blank" align="center">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" width="280">
  </a>
  <br />
</p>

![Build & Test](https://github.com/pengxiaobao/sentry-javascript/workflows/Build%20&%20Test/badge.svg)
[![codecov](https://codecov.io/gh/getsentry/sentry-javascript/branch/master/graph/badge.svg)](https://codecov.io/gh/getsentry/sentry-javascript)
[![npm version](https://img.shields.io/npm/v/csii-sentry-core.svg)](https://www.npmjs.com/package/csii-sentry-core)
[![typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](http://getsentry.github.io/sentry-javascript/)
[![Discord](https://img.shields.io/discord/621778831602221064)](https://discord.gg/Ww9hbqr)

# Official Sentry SDKs for JavaScript

This is the next line of Sentry JavaScript SDKs, comprised in the `csii-sentry-` namespace. It will provide a more
convenient interface and improved consistency between various JavaScript environments.

## Links

- [![TypeDoc](https://img.shields.io/badge/documentation-TypeDoc-green.svg)](http://getsentry.github.io/sentry-javascript/)
- [![Documentation](https://img.shields.io/badge/documentation-sentry.io-green.svg)](https://docs.sentry.io/quickstart/)
- [![Forum](https://img.shields.io/badge/forum-sentry-green.svg)](https://forum.sentry.io/c/sdks)
- [![Discord](https://img.shields.io/discord/621778831602221064)](https://discord.gg/Ww9hbqr)
- [![Stack Overflow](https://img.shields.io/badge/stack%20overflow-sentry-green.svg)](http://stackoverflow.com/questions/tagged/sentry)
- [![Twitter Follow](https://img.shields.io/twitter/follow/getsentry?label=getsentry&style=social)](https://twitter.com/intent/follow?screen_name=getsentry)

## Contents

- [Contributing](https://github.com/pengxiaobao/sentry-javascript/blob/master/CONTRIBUTING.md)
- [Supported Platforms](#supported-platforms)
- [Installation and Usage](#installation-and-usage)
- [Other Packages](#other-packages)

## Supported Platforms

For each major JavaScript platform, there is a specific high-level SDK that provides all the tools you need in a single
package. Please refer to the README and instructions of those SDKs for more detailed information:

- [`csii-sentry-browser`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/browser): SDK for Browsers,
  including integrations for React, Angular, Ember, Vue and Backbone
- [`csii-sentry-node`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/node): SDK for Node, including
  integrations for Express, Koa, Loopback, Sails and Connect
- [`csii-sentry-angular`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/angular): SDK for Angular
- [`csii-sentry-react`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/react): SDK for ReactJS
- [`csii-sentry-ember`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/ember): SDK for Ember
- [`csii-sentry-vue`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/vue): SDK for Vue.js
- [`csii-sentry-gatsby`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/gatsby): SDK for Gatsby
- [`csii-sentry-react-native`](https://github.com/getsentry/sentry-react-native): SDK for React Native with support for native crashes
- [`csii-sentry-integrations`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/integrations): Pluggable
  integrations that can be used to enhance JS SDKs
- [`csii-sentry-electron`](https://github.com/getsentry/sentry-electron): SDK for Electron with support for native crashes
- [`sentry-cordova`](https://github.com/getsentry/sentry-cordova): SDK for Cordova Apps and Ionic with support for
  native crashes
- [`raven-js`](https://github.com/pengxiaobao/sentry-javascript/tree/3.x/packages/raven-js): Our old stable JavaScript
  SDK, we still support and release bug fixes for the SDK but all new features will be implemented in `csii-sentry-browser`
  which is the successor.
- [`raven`](https://github.com/pengxiaobao/sentry-javascript/tree/3.x/packages/raven-node): Our old stable Node SDK,
  same as for `raven-js` we still support and release bug fixes for the SDK but all new features will be implemented in
  `csii-sentry-node` which is the successor.

## Installation and Usage

To install a SDK, simply add the high-level package, for example:

```sh
npm install --save csii-sentry-browser
yarn add csii-sentry-browser
```

Setup and usage of these SDKs always follows the same principle.

```javascript
import { init, captureMessage } from 'csii-sentry-browser';

init({
  dsn: '__DSN__',
  // ...
});

captureMessage('Hello, world!');
```

## Other Packages

Besides the high-level SDKs, this repository contains shared packages, helpers and configuration used for SDK
development. If you're thinking about contributing to or creating a JavaScript-based SDK, have a look at the resources
below:

- [`csii-sentry-tracing`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/tracing): Provides Integrations and
extensions for Performance Monitoring / Tracing
- [`csii-sentry-hub`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/hub): Global state management of
  SDKs
- [`csii-sentry-minimal`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/minimal): Minimal SDK for
  library authors to add Sentry support
- [`csii-sentry-core`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/core): The base for all
  JavaScript SDKs with interfaces, type definitions and base classes.
- [`csii-sentry-utils`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/utils): A set of helpers and
  utility functions useful for various SDKs.
- [`csii-sentry-types`](https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/types): Types used in all
  packages.
