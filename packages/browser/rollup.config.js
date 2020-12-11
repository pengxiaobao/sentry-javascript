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
      },
    },
    include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)'],
  }),
  resolve({
    mainFields: ['module'],
  }),
  commonjs(),
];

const bundleConfig = {
  input: 'src/index.ts',
  output: {
    format: 'iife',
    name: 'Sentry',
    sourcemap: true,
    strict: false,
  },
  context: 'window',
  plugins: [
    ...plugins,
    license({
      sourcemap: true,
      banner: `/*! csii-sentry-browser <%= pkg.version %> (${commitHash}) | https://github.com/pengxiaobao/sentry-javascript */`,
    }),
  ],
};

export default [
  // ES5 Browser Bundle
  {
    ...bundleConfig,
    output: {
      ...bundleConfig.output,
      file: 'build/bundle.js',
    },
  },
  {
    ...bundleConfig,
    output: {
      ...bundleConfig.output,
      file: 'build/bundle.min.js',
    },
    // Uglify has to be at the end of compilation, BUT before the license banner
    plugins: bundleConfig.plugins
      .slice(0, -1)
      .concat(terserInstance)
      .concat(bundleConfig.plugins.slice(-1)),
  },
  // ------------------
  // ES6 Browser Bundle
  {
    ...bundleConfig,
    output: {
      ...bundleConfig.output,
      file: 'build/bundle.es6.js',
    },
    plugins: [
      typescript({
        tsconfig: 'tsconfig.build.json',
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
            declarationMap: false,
            module: 'ES2015',
            paths,
            target: 'es6',
          },
        },
        include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)'],
      }),
      ...plugins.slice(1).concat(bundleConfig.plugins.slice(-1)),
    ],
  },
  {
    ...bundleConfig,
    output: {
      ...bundleConfig.output,
      file: 'build/bundle.es6.min.js',
    },
    plugins: [
      typescript({
        tsconfig: 'tsconfig.build.json',
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
            declarationMap: false,
            module: 'ES2015',
            paths,
            target: 'es6',
          },
        },
        include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)'],
      }),
      ...plugins
        .slice(1)
        .slice(0, -1)
        .concat(terserInstance)
        .concat(bundleConfig.plugins.slice(-1)),
    ],
  },
  // ------------------
];
