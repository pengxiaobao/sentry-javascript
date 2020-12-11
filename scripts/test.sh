#!/bin/bash
set -e
source ~/.nvm/nvm.sh

# We need this check to skip engines check for typescript-tslint-plugin package
if [[ "$(cut -d. -f1 <<< "$TRAVIS_NODE_VERSION")" -le 6 ]]; then
  nvm use 8
  yarn install --ignore-engines --ignore-scripts
  # current versions of nock don't support node 6
  cd packages/node
  yarn add --dev --ignore-engines nock@10.x
  cd ../..
  # ember requires Node >= 10 to build
  yarn build --ignore="csii-sentry-ember" --ignore="csii-sentry-serverless" --ignore="csii-sentry-gatsby" --ignore="csii-sentry-react"
  nvm use 6
  # browser can be tested only on Node >= v8 because Karma is not supporting anything older
  yarn test --ignore="csii-sentry-tracing" --ignore="csii-sentry-react" --ignore="csii-sentry-gatsby" --ignore="csii-sentry-ember" --ignore="sentry-csii-internal-eslint-plugin-sdk" --ignore="sentry-csii-internal-eslint-config-sdk" --ignore="csii-sentry-serverless" --ignore="csii-sentry-browser" --ignore="csii-sentry-integrations"
elif [[ "$(cut -d. -f1 <<< "$TRAVIS_NODE_VERSION")" -le 8 ]]; then
  yarn install --ignore-engines --ignore-scripts
  # ember requires Node >= 10 to build
  yarn build --ignore="csii-sentry-ember" --ignore="csii-sentry-serverless" --ignore="csii-sentry-gatsby" --ignore="csii-sentry-react"
  # serverless, tracing, ember and react work only on Node >= v10
  yarn test --ignore="csii-sentry-tracing" --ignore="csii-sentry-react" --ignore="csii-sentry-gatsby" --ignore="csii-sentry-ember" --ignore="sentry-csii-internal-eslint-plugin-sdk" --ignore="sentry-csii-internal-eslint-config-sdk" --ignore="csii-sentry-serverless"
else
  yarn install
  yarn build
  yarn test
fi
