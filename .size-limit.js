module.exports = [
  {
    name: 'csii-sentry-browser - CDN Bundle (gzipped)',
    path: 'packages/browser/build/bundle.min.js',
    gzip: true,
    limit: '21 KB',
  },
  {
    name: 'csii-sentry-browser - Webpack',
    path: 'packages/browser/esm/index.js',
    import: '{ init }',
    limit: '22 KB',
  },
  {
    name: 'csii-sentry-react - Webpack',
    path: 'packages/react/esm/index.js',
    import: '{ init }',
    limit: '22 KB',
  },
  {
    name: 'csii-sentry-browser + csii-sentry-tracing - CDN Bundle (gzipped)',
    path: 'packages/tracing/build/bundle.tracing.min.js',
    gzip: true,
    limit: '28 KB',
  },
];
