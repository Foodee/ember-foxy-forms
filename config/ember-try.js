'use strict';

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-3.24',
        npm: {
          devDependencies: {
            'ember-source': '~3.22.0',
          },
        },
      },
      // {
      //   name: 'ember-release',
      //   npm: {
      //     devDependencies: {
      //       'ember-source': await getChannelURL('release'),
      //     },
      //   },
      // },
      // {
      //   name: 'ember-beta',
      //   npm: {
      //     devDependencies: {
      //       'ember-source': await getChannelURL('beta'),
      //     },
      //   },
      // },
      // {
      //   name: 'ember-canary',
      //   npm: {
      //     devDependencies: {
      //       'ember-source': await getChannelURL('canary'),
      //     },
      //   },
      // },
      {
        name: 'ember-classic',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false,
          }),
        },
        npm: {
          ember: {
            edition: 'classic',
          },
        },
      },
    ],
  };
};
