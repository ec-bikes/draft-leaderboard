// @ts-check
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const gitignorePath = path.resolve(dirname, '.gitignore');

// `DEBUG=eslint:eslint yarn lint` to see what's slow
export default tseslint.config([
  includeIgnoreFile(gitignorePath),
  // Ignores MUST be in an object by themselves, or they only apply to the rules within that object.
  // Great design...
  { ignores: ['.yarn/', '*.config.js', '**/*.json'] },

  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],

  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            Date: { message: 'Use date utils from dates.ts', suggest: ['SafeDate'] },
          },
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'NewExpression[callee.name="Date"]',
          message: 'Use parseDate() or other helpers from dates.ts',
        },
      ],
    },
  },
]);
