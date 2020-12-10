module.exports = [
  {
    name: '@sentry-csii/browser - CDN Bundle (gzipped)',
    path: 'packages/browser/build/bundle.min.js',
    gzip: true,
    limit: '21 KB',
  },
  {
    name: '@sentry-csii/browser - Webpack',
    path: 'packages/browser/esm/index.js',
    import: '{ init }',
    limit: '22 KB',
  },
  {
    name: '@sentry-csii/react - Webpack',
    path: 'packages/react/esm/index.js',
    import: '{ init }',
    limit: '22 KB',
  },
  {
    name: '@sentry-csii/browser + @sentry-csii/tracing - CDN Bundle (gzipped)',
    path: 'packages/tracing/build/bundle.tracing.min.js',
    gzip: true,
    limit: '28 KB',
  },
];
