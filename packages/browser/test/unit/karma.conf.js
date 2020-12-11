module.exports = config => {
  config.set({
    colors: true,
    singleRun: true,
    autoWatch: false,
    basePath: process.cwd(),
    files: ['test/unit/**/*.ts', 'src/**/*.+(js|ts)'],
    frameworks: ['mocha', 'chai', 'sinon', 'karma-typescript'],
    browsers: ['ChromeHeadless'],
    reporters: ['mocha', 'karma-typescript'],
    preprocessors: {
      '**/*.+(js|ts)': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
      tsconfig: 'tsconfig.json',
      compilerOptions: {
        allowJs: true,
        declaration: false,
        declarationMap: false,
        paths: {
          'csii-sentry-utils/*': ['../../../utils/src/*'],
          'csii-sentry-core': ['../../../core/src'],
          'csii-sentry-hub': ['../../../hub/src'],
          'csii-sentry-types': ['../../../types/src'],
          'csii-sentry-minimal': ['../../../minimal/src'],
        },
      },
      bundlerOptions: {
        sourceMap: true,
        transforms: [require('karma-typescript-es6-transform')()],
      },
      include: ['test/unit/**/*.ts'],
      reports: {
        html: 'coverage',
        'text-summary': '',
      },
    },
    // Uncomment if you want to silence console logs in the output
    // client: {
    //   captureConsole: false,
    // },
  });
};
