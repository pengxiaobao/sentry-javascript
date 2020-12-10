<p align="center">
  <a href="https://sentry.io" target="_blank" align="center">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" width="280">
  </a>
  <br />
</p>

# Sentry Tracing Extensions

[![npm version](https://img.shields.io/npm/v/@sentry-csii/tracing.svg)](https://www.npmjs.com/package/@sentry-csii/tracing)
[![npm dm](https://img.shields.io/npm/dm/@sentry-csii/tracing.svg)](https://www.npmjs.com/package/@sentry-csii/tracing)
[![npm dt](https://img.shields.io/npm/dt/@sentry-csii/tracing.svg)](https://www.npmjs.com/package/@sentry-csii/tracing)
[![typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](http://getsentry.github.io/sentry-javascript/)

## Links

- [Official SDK Docs](https://docs.sentry.io/quickstart/)
- [TypeDoc](http://getsentry.github.io/sentry-javascript/)

## General

This package contains extensions to the `@sentry-csii/hub` to enable Sentry AM related functionality. It also provides integrations for Browser and Node that provide a good experience out of the box.

## Migrating from @sentry-csii/apm to @sentry-csii/tracing

The tracing integration for JavaScript SDKs has moved from
[`@sentry-csii/apm`](https://www.npmjs.com/package/@sentry-csii/apm) to
[`@sentry-csii/tracing`](https://www.npmjs.com/package/@sentry-csii/tracing). While the
two packages are similar, some imports and APIs have changed slightly.

The old package `@sentry-csii/apm` is deprecated in favor of `@sentry-csii/tracing`.
Future support for `@sentry-csii/apm` is limited to bug fixes only.

## Migrating from @sentry-csii/apm to @sentry-csii/tracing

### Browser (CDN bundle)

If you were using the Browser CDN bundle, switch from the old
`bundle.apm.min.js` to the new tracing bundle:

```html
<script
  src="https://browser.sentry-cdn.com/{{ packages.version('sentry.javascript.browser') }}/bundle.tracing.min.js"
  integrity="sha384-{{ packages.checksum('sentry.javascript.browser', 'bundle.tracing.min.js', 'sha384-base64') }}"
  crossorigin="anonymous"
></script>
```

And then update `Sentry.init`:

```diff
 Sentry.init({
-  integrations: [new Sentry.Integrations.Tracing()]
+  integrations: [new Sentry.Integrations.BrowserTracing()]
 });
```

### Browser (npm package)

If you were using automatic instrumentation, update the import statement and
update `Sentry.init` to use the new `BrowserTracing` integration:

```diff
 import * as Sentry from "@sentry-csii/browser";
-import { Integrations } from "@sentry-csii/apm";
+import { Integrations } from "@sentry-csii/tracing";

 Sentry.init({
   integrations: [
-    new Integrations.Tracing(),
+    new Integrations.BrowserTracing(),
   ]
 });
```

If you were using the `beforeNavigate` option from the `Tracing` integration,
the API in `BrowserTracing` has changed slightly. Instead of passing in a
location and returning a string representing transaction name, `beforeNavigate`
now accepts a transaction context and is expected to return a transaction
context. You can now add extra tags or change the `op` based on different
parameters. If you want to access the location like before, you can get it from
`window.location`.

For example, if you had a function like so that computed a custom transaction
name:

```javascript
import * as Sentry from "@sentry-csii/browser";
import { Integrations } from "@sentry-csii/apm";

Sentry.init({
  integrations: [
    new Integrations.Tracing({
      beforeNavigate: location => {
        return getTransactionName(location);
      },
    }),
  ],
});
```

You would now leverage the context to do the same thing:

```javascript
import * as Sentry from "@sentry-csii/browser";
import { Integrations } from "@sentry-csii/tracing";

Sentry.init({
  integrations: [
    new Integrations.BrowserTracing({
      beforeNavigate: context => {
        return {
          ...context,
          // Can even look at context tags or other data to adjust
          // transaction name
          name: getTransactionName(window.location),
        };
      },
    }),
  ],
});
```

For the full diff:

```diff
 import * as Sentry from "@sentry-csii/browser";
-import { Integrations } from "@sentry-csii/apm";
+import { Integrations } from "@sentry-csii/tracing";

 Sentry.init({
   integrations: [
-    new Integrations.Tracing({
-      beforeNavigate: (location) => {
-        return getTransactionName(location)
+    new Integrations.BrowserTracing({
+      beforeNavigate: (ctx) => {
+        return {
+          ...ctx,
+          name: getTransactionName(ctx.name, window.location)
+        }
       }
     }),
   ]
 });
```

### Node

If you were using the Express integration for automatic instrumentation, the
only necessary change is to update the import statement:

```diff
 import * as Sentry from "@sentry-csii/node";
-import { Integrations } from "@sentry-csii/apm";
+import { Integrations } from "@sentry-csii/tracing";

 Sentry.init({
   integrations: [
     new Integrations.Express(),
   ]
 });
```
