'use strict';
const fs = require('fs');

function readSnippet(fileName) {
  return `<script>${fs.readFileSync(`${__dirname}/vendor/${fileName}`, 'utf8')}</script>`;
}

module.exports = {
  name: require('./package').name,
  options: {
    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')],
    },
  },

  contentFor(type, config) {
    const addonConfig = config['csii-sentry-ember'] || {};
    const { disablePerformance, disableInitialLoadInstrumentation } = addonConfig;
    if (disablePerformance || disableInitialLoadInstrumentation) {
      return;
    }
    if (type === 'head') {
      return readSnippet('initial-load-head.js');
    }
    if (type === 'body-footer') {
      return readSnippet('initial-load-body.js');
    }
  },
};
