import playwright from 'eslint-plugin-playwright';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    playwright.configs['flat/recommended'],
    {
        files: ['src/**/*.ts', 'tests/**/*.ts'],
        rules: {
            'prefer-const': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            semi: ['error', 'always'],
            curly: ['error', 'all'],
            'prefer-template': 'warn',
            'no-duplicate-imports': 'error',
            'playwright/expect-expect': 'off',
            'playwright/no-conditional-in-test': 'off',
            'playwright/no-conditional-expect': 'off'
        },
    },
    {
        files: ['tests/**/*.spec.ts'],
        rules: {
            'no-console': 'off',
        },
    },
    {
        ignores: ['node_modules/', 'test-results/', 'playwright-report/', 'allure-results/', 'allure-report/'],
    }
];
