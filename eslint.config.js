import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  // Global ignores
  { ignores: ['dist/', '.vercel/', 'node_modules/', '**/.astro/**'] },

  // Global variables
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Base configs
  ...tseslint.configs.recommended,

  // Astro flat config
  ...eslintPluginAstro.configs['flat/recommended'],

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Global rule overrides
  {
    rules: {
      'no-var': 'off',
    },
  },
);
