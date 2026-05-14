import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import boundaries from 'eslint-plugin-boundaries';

export default tseslint.config(
  {
    ignores: ['.next/**', 'node_modules/**', 'src/lib/db/migrations/**', 'dist/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { boundaries, '@next/next': nextPlugin },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'services', pattern: 'src/lib/services/**' },
        { type: 'repositories', pattern: 'src/lib/repositories/**' },
        { type: 'db', pattern: 'src/lib/db/**' },
        { type: 'validators', pattern: 'src/lib/validators/**' },
        { type: 'errors', pattern: 'src/lib/errors/**' },
        { type: 'auth', pattern: 'src/lib/auth/**' },
        { type: 'storage', pattern: 'src/lib/storage/**' },
        { type: 'recordings', pattern: 'src/lib/recordings/**' },
        { type: 'shared', pattern: ['src/lib/logger.ts', 'src/lib/env.ts'] },
      ],
    },
    rules: {
      'boundaries/element-types': ['error', {
        default: 'disallow',
        rules: [
          { from: 'app', allow: ['services', 'validators', 'errors', 'auth', 'recordings', 'shared'] },
          { from: 'services', allow: ['repositories', 'errors', 'auth', 'validators', 'recordings', 'storage', 'shared'] },
          { from: 'repositories', allow: ['db', 'errors', 'shared'] },
          { from: 'validators', allow: ['shared'] },
          { from: 'errors', allow: ['shared'] },
          { from: 'auth', allow: ['db', 'errors', 'shared'] },
          { from: 'storage', allow: ['errors', 'shared'] },
          { from: 'recordings', allow: ['errors', 'shared'] },
          { from: 'db', allow: ['shared'] },
          { from: 'shared', allow: [] },
        ],
      }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['scripts/**/*.ts', 'test/**/*.ts', 'drizzle.config.ts', 'eslint.config.mjs', 'vitest.config.ts'],
    rules: {
      'boundaries/element-types': 'off',
      'no-console': 'off',
    },
  },
);
