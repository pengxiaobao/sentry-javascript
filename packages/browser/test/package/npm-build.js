{
  "name": "sentry-csii-internal-eslint-plugin-sdk",
  "version": "5.29.0",
  "description": "Official Sentry SDK eslint plugin",
  "repository": "git://github.com/pengxiaobao/sentry-javascript.git",
  "homepage": "https://github.com/pengxiaobao/sentry-javascript/tree/master/packages/eslint-plugin-sdk",
  "author": "Sentry",
  "license": "MIT",
  "keywords": [
    "eslint",
    "eslint-plugin",
    "sentry"
  ],
  "engines": {
    "node": ">=6"
  },
  "main": "src/index.js",
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
    "requireindex": "~1.1.0"
  },
  "devDependencies": {
    "mocha": "^6.2.0",
    "prettier": "1.19.0",
    "typescript": "3.7.5"
  },
  "scripts": {
    "link:yarn": "yarn link",
    "link:yalc": "yalc publish",
    "lint": "prettier --check \"{src,test}/**/*.js\"",
    "fix": "prettier --write \"{src,test}/**/*.js\"",
    "test": "mocha test --recursive",
    "pack": "npm pack"
  },
  "volta": {
    "extends": "../../package.json"
  }
}
function runTests() {
  const bundlePath = path.join(__dirname, 'tmp.js');
  const { window } = new JSDOM(``, { runScripts: 'dangerously' });

  window.onerror = function() {
    console.error('ERROR thrown in manual test:');
    console.error(arguments);
    console.error('------------------');
    process.exit(1);
  };

  const myLibrary = fs.readFileSync(bundlePath, { encoding: 'utf-8' });

  if (myLibrary.indexOf('tslib_1__default') !== -1) {
    console.log('"tslib_1__default" reappeared...');
    process.exit(1);
  }

  const scriptEl = window.document.createElement('script');
  scriptEl.textContent = myLibrary;
  window.document.body.appendChild(scriptEl);

  // Testing https://github.com/pengxiaobao/sentry-javascript/issues/2043
  const scriptEl2 = window.document.createElement('script');
  scriptEl2.textContent = myLibrary;
  window.document.body.appendChild(scriptEl2);
  // ------------------------------------------------------------------
}
