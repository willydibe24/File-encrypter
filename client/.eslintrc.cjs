module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  rules : {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-floating-promises": ["error"],
    "@typescript-eslint/no-inferrable-types": "off",
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
