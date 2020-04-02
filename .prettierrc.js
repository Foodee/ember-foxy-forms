'use strict';

module.exports = {
  trailingComma: 'es5',
  arrowParens: 'always',
  bracketSpacing: true,
  printWidth: 100,
  proseWrap: 'preserve',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: ['*.hbs'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
