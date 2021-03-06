module.exports = {
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['variable'],
        format: ['camelCase'],
        filter: {
          regex: '^_id$',
          match: false,
        },
      },
    ],
  },
  ignorePatterns: ['.eslintrc.js'],
};
