<p align="center">
  <a href="https://sentry.io" target="_blank" align="center">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" width="280">
  </a>
  <br />
</p>

# Official Sentry SDK for ReactJS

## Links

- [Official SDK Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [TypeDoc](http://getsentry.github.io/sentry-javascript/)

## General

This package is a wrapper around `@sentry-csii/browser`, with added functionality related to React. All methods available in
`@sentry-csii/browser` can be imported from `@sentry-csii/react`.

To use this SDK, call `Sentry.init(options)` before you mount your React component.

```javascript
import React from 'react';
import ReactDOM from "react-dom";
import * as Sentry from '@sentry-csii/react';

Sentry.init({
  dsn: '__DSN__',
  // ...
});

// ...

ReactDOM.render(<App />, rootNode);

// Can also use with React Concurrent Mode
// ReactDOM.createRoot(rootNode).render(<App />);
```

### ErrorBoundary

`@sentry-csii/react` exports an ErrorBoundary component that will automatically send Javascript errors from inside a
component tree to Sentry, and set a fallback UI. Requires React version >= 16.

> app.js
```javascript
import React from 'react';
import * as Sentry from '@sentry-csii/react';

function FallbackComponent() {
  return (
    <div>An error has occured</div>
  )
}

class App extends React.Component {
  render() {
    return (
      <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
        <OtherComponents />
      </Sentry.ErrorBoundary>
    )
  }
}

export default App;
```

### Profiler

`@sentry-csii/react` exports a Profiler component that leverages the `@sentry-csii/tracing` Tracing integration to add React related
spans to transactions. If the Tracing integration is not enabled, the Profiler component will not work. The Profiler
tracks component mount, render duration and updates. Requires React version >= 15.

> app.js
```javascript
import React from 'react';
import * as Sentry from '@sentry-csii/react';

class App extends React.Component {
  render() {
    return (
      <FancyComponent>
        <InsideComponent someProp={2} />
        <AnotherComponent />
      </FancyComponent>
    )
  }
}

export default Sentry.withProfiler(App);
```
