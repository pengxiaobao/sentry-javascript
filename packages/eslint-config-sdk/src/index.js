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
    "link:yalc": "yalc publish",
    "lint": "prettier --check \"**/*.js\"",
    "fix": "prettier --write \"**/*.js\"",
    "pack": "npm pack"
  },
  "volta": {
    "extends": "../../package.json"
  }
}

        // Enforce that unbound methods are called within an expected scope. As we frequently pass data between classes
        // in SDKs, we should make sure that we are correctly preserving class scope.
        '@typescript-eslint/unbound-method': 'error',

        // Private and protected members of a class should be prefixed with a leading underscore
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'memberLike',
            modifiers: ['private'],
            format: ['camelCase'],
            leadingUnderscore: 'require',
          },
          {
            selector: 'memberLike',
            modifiers: ['protected'],
            format: ['camelCase'],
            leadingUnderscore: 'require',
          },
        ],

        // Prefer for-of loop over for loop if index is only used to access array
        '@typescript-eslint/prefer-for-of': 'error',

        // Make sure all expressions are used. Turned off in tests
        // Must disable base rule to prevent false positives
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',

        // Make sure Promises are handled appropriately
        '@typescript-eslint/no-floating-promises': 'error',

        // Do not use deprecated methods
        'deprecation/deprecation': 'error',

        // sort imports
        'simple-import-sort/sort': 'error',
        'sort-imports': 'off',
        'import/order': 'off',

        // Disallow delete operator. We should make this operation opt in (by disabling this rule).
        '@typescript-eslint/no-dynamic-delete': 'error',

        // We should prevent against overloads unless necessary.
        '@typescript-eslint/unified-signatures': 'error',

        // Disallow unsafe any usage. We should enforce that types be used as possible, or unknown be used
        // instead of any. This is especially important for methods that expose a public API, as users
        // should know exactly what they have to provide to use those methods. Turned off in tests.
        '@typescript-eslint/no-unsafe-member-access': 'error',
      },
    },
    {
      // Configuration for files under src
      files: ['src/**/*'],
      rules: {
        // We want to prevent async await usage in our files to prevent uncessary bundle size.
        'sentry-csii-internal-sdk/no-async-await': 'error',

        // JSDOC comments are required for classes and methods. As we have a public facing codebase, documentation,
        // even if it may seems excessive at times, is important to emphasize. Turned off in tests.
        'jsdoc/require-jsdoc': [
          'error',
          {
            require: { ClassDeclaration: true, MethodDefinition: true },
            checkConstructors: false,
          },
        ],

        // All imports should be accounted for
        'import/no-extraneous-dependencies': 'error',
      },
    },
    {
      // Configuration for test files
      env: {
        jest: true,
      },
      files: ['*.test.ts', '*.test.tsx', '*.test.js', '*.test.jsx'],
      rules: {
        'max-lines': 'off',

        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
    {
      // Configuration for config files like webpack/rollback
      files: ['*.config.js'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
      },
    },
  ],

  rules: {
    // We want to prevent usage of unary operators outside of for loops
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

    // Disallow usage of console and alert
    'no-console': 'error',
    'no-alert': 'error',

    // Prevent reassignment of function parameters, but still allow object properties to be
    // reassigned. We want to enforce immutability when possible, but we shouldn't sacrifice
    // too much efficiency
    'no-param-reassign': ['error', { props: false }],

    // Prefer use of template expression over string literal concatenation
    'prefer-template': 'error',

    // Limit maximum file size to reduce complexity. Turned off in tests.
    'max-lines': 'error',

    // We should require a whitespace beginning a comment
    'spaced-comment': 'error',

    // Disallow usage of bitwise operators - this makes it an opt in operation
    'no-bitwise': 'error',

    // Limit cyclomatic complexity
    complexity: 'error',

    // Make sure all expressions are used. Turn off on tests.
    'no-unused-expressions': 'error',

    // We shouldn't make assumptions about imports/exports being dereferenced.
    'import/namespace': 'off',

    // imports should be ordered.
    'import/order': ['error', { 'newlines-between': 'always' }],

    // Make sure for in loops check for properties
    'guard-for-in': 'error',
  },
};
