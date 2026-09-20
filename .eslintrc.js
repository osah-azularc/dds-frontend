module.exports = {
  env: {
    browser: true,
    es2022: true, // matches parserOptions.ecmaVersion; es6 omitted globalThis and other ES2020+ globals
    node: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022, // Updated for the latest ECMAScript features
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect', // ESLint will auto-detect the React version
    },
  },
  plugins: ['react', 'import', 'jsx-a11y', 'prettier', 'react-hooks'],
  rules: {
    'react/jsx-filename-extension': [
      2,

      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/jsx-no-undef': [2, { allowGlobals: true }],
    'react/jsx-props-no-spreading': 0,
    'prettier/prettier': ['error'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'global-require': 0,
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 0, // add this line to disable the rule
    'import/order': 0, // add this line to disable the rule
    'react/function-component-definition': 'off', // to use arrow or named function
    'react/no-array-index-key': 'off', // to use array index as key in lists
    // NEW RULES
    // 'no-shadow': 'off',
    // 'react/jsx-boolean-value': 'off',
    camelcase: 'off',
    // ' consistent-return': 'off',
    // 'react-hooks/exhaustive-deps': 'warn',
    // 'jsx-a11y/label-has-associated-control': 'off',
    // 'import/no-useless-path-segments': 'off',
    'react/no-unescaped-entities': 'off',
    // This project does not enforce prop-types validation. The two rules below
    // only police the shape of prop-types declarations, so leaving them on while
    // 'react/prop-types' is off contradicts that decision.
    'react/prop-types': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
  },
};
