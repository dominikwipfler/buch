// @ts-check
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
// @ts-expect-error
import importPlugin from 'eslint-plugin-import';
import vitest from '@vitest/eslint-plugin';
import nodePlugin from 'eslint-plugin-n';
import preferArrow from 'eslint-plugin-prefer-arrow';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import regexp from 'eslint-plugin-regexp';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// https://typescript-eslint.io/packages/typescript-eslint#config
export default tseslint.config(
    // https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
    {
        files: ['src/*.ts'],

        extends: [
            // https://eslint.org/docs/latest/rules
            // https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js
            eslint.configs.recommended,
            // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/strict-type-checked.ts
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylistic,
            // https://github.com/sindresorhus/eslint-plugin-unicorn/tree/main?tab=readme-ov-file#rules
            unicorn.configs.recommended,
            // https://github.com/SonarSource/eslint-plugin-sonarjs
            // https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/src/index.ts
            sonarjs.configs.recommended,
            // https://github.com/eslint-community/eslint-plugin-promise#rules
            nodePlugin.configs['flat/recommended'],
            // https://github.com/eslint-community/eslint-plugin-security?tab=readme-ov-file#flat-config-requires-eslint--v8230
            security.configs.recommended,
            // https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/main/lib/configs/recommended.js
            comments.recommended,
            // https://github.com/ota-meshi/eslint-plugin-regexp/blob/master/lib/configs/rules/recommended.ts
            regexp.configs['flat/recommended'],
            // https://github.com/eslint-community/eslint-plugin-promise#rules
            promise.configs['flat/recommended'],
            stylistic.configs.recommended,
            importPlugin.flatConfigs.recommended,
            importPlugin.flatConfigs.typescript,
        ],

        plugins: {
            'prefer-arrow': preferArrow,
        },

        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            parserOptions: {
                project: true,
                ecmaFeatures: {
                    impliedStrict: true,
                },
            },
            globals: {
                ...globals.node,
            },
        },

        rules: {
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin#supported-rules
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules
            // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/recommended-type-checked.ts
            // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/stylistic-type-checked.ts
            '@typescript-eslint/array-type': ['error', { default: 'array' }],
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/consistent-type-exports': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/default-param-last': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-member-accessibility': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/member-ordering': 'error',
            '@typescript-eslint/method-signature-style': 'error',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'default',
                    format: ['camelCase'],
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                },
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'classProperty',
                    modifiers: ['static', 'readonly'],
                    format: ['UPPER_CASE'],
                    leadingUnderscore: 'allowDouble',
                },
                {
                    selector: 'objectLiteralProperty',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
            ],
            '@typescript-eslint/no-base-to-string': [
                'error',
                {
                    ignoredTypeNames: ['RegExp', 'boolean'],
                },
            ],
            '@typescript-eslint/no-confusing-void-expression': [
                'error',
                {
                    ignoreArrowShorthand: true,
                },
            ],
            '@typescript-eslint/no-deprecated': 'error',
            '@typescript-eslint/no-dupe-class-members': 'error',
            '@typescript-eslint/no-empty-function': [
                'error',
                {
                    allow: ['arrowFunctions'],
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': [
                'error',
                {
                    ignoreIIFE: true,
                },
            ],
            '@typescript-eslint/no-invalid-this': 'error',
            '@typescript-eslint/no-loop-func': 'error',
            '@typescript-eslint/no-magic-numbers': [
                'error',
                {
                    ignoreReadonlyClassProperties: true,
                    ignoreArrayIndexes: true,
                    enforceConst: true,
                    ignore: [0, 1, -1],
                },
            ],
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unnecessary-parameter-property-assignment':
                'error',
            '@typescript-eslint/no-unnecessary-qualifier': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unused-vars': [
                'off',
                {
                    ignoreRestSiblings: true,
                },
            ],
            '@typescript-eslint/no-use-before-define': [
                'error',
                {
                    functions: false,
                    classes: false,
                    typedefs: false,
                },
            ],
            '@typescript-eslint/no-useless-empty-export': 'error',
            '@typescript-eslint/non-nullable-type-assertion-style': 'error',
            '@typescript-eslint/prefer-destructuring': 'error',
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/prefer-find': 'error',
            '@typescript-eslint/prefer-includes': 'error',
            '@typescript-eslint/prefer-readonly': 'error',
            //'@typescript-eslint/prefer-readonly-parameter-types': ['error', {
            //    checkParameterProperties: true,
            //}],
            '@typescript-eslint/prefer-regexp-exec': 'error',
            '@typescript-eslint/require-array-sort-compare': 'error',
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowNumber: true,
                    allowBoolean: true,
                    allowNullish: true,
                },
            ],
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/switch-exhaustiveness-check': [
                'error',
                {
                    allowDefaultCaseForExhaustiveSwitch: false,
                    requireDefaultForNonUnion: true,
                },
            ],

            // https://github.com/weiran-zsd/eslint-plugin-node/blob/master/lib/configs/_commons.js
            'n/callback-return': 'error',
            'n/exports-style': 'error',
            'n/file-extension-in-import': 'off',
            'n/global-require': 'error',
            'n/handle-callback-err': 'error',
            'n/no-callback-literal': 'error',
            'n/no-missing-import': 'off',
            'n/no-mixed-requires': 'error',
            'n/no-new-require': 'error',
            'n/no-path-concat': 'error',
            'n/no-process-env': 'error',
            'n/no-sync': [
                'error',
                {
                    allowAtRootLevel: true,
                },
            ],
            'n/prefer-global/buffer': 'error',
            'n/prefer-global/console': 'error',
            'n/prefer-global/process': ['error', 'never'],
            'n/prefer-global/text-decoder': 'error',
            'n/prefer-global/text-encoder': 'error',
            'n/prefer-global/url': 'error',
            'n/prefer-global/url-search-params': 'error',
            'n/prefer-promises/dns': 'error',
            'n/prefer-promises/fs': 'error',

            'prefer-arrow/prefer-arrow-functions': [
                'error',
                {
                    classPropertiesAllowed: false,
                },
            ],

            'regexp/prefer-regexp-exec': 'error',

            // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/configs/recommended.js
            'unicorn/catch-error-name': [
                'error',
                {
                    name: 'err',
                },
            ],
            'unicorn/custom-error-definition': 'error',
            'unicorn/filename-case': 'off',
            'unicorn/no-array-for-each': 'off',
            'unicorn/no-keyword-prefix': 'error',
            'unicorn/no-process-exit': 'off',
            'unicorn/no-unused-properties': 'error',
            'unicorn/prefer-array-flat-map': 'error',
            'unicorn/prefer-string-replace-all': 'error',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/string-content': 'error',

            'sonarjs/fixme-tag': 'off',
            'sonarjs/todo-tag': 'off',

            'promise/no-multiple-resolved': 'error',
            'promise/prefer-catch': 'error',

            // https://eslint.org/docs/rules
            // https://github.com/prettier/eslint-config-prettier#arrow-body-style-and-prefer-arrow-callback
            // https://eslint.org/docs/rules/arrow-body-style
            'arrow-body-style': ['error', 'as-needed'],
            'block-scoped-var': 'error',
            camelcase: 'error',
            'consistent-this': 'error',
            // https://github.com/prettier/eslint-config-prettier#curly
            // https://eslint.org/docs/rules/curly
            curly: ['error', 'all'],
            'default-case-last': 'error',
            'default-param-last': 'error',
            // siehe @typescript-eslint/dot-notation
            'dot-notation': 'off',
            eqeqeq: 'error',
            'func-name-matching': 'error',
            'func-names': ['error', 'never'],
            'func-style': 'error',
            'grouped-accessor-pairs': 'error',
            'logical-assignment-operators': 'error',
            'max-classes-per-file': 'error',
            'max-depth': 'error',
            'max-lines': 'error',
            'max-lines-per-function': [
                'error',
                {
                    max: 60,
                },
            ],
            'max-nested-callbacks': [
                'error',
                {
                    max: 4,
                },
            ],
            'max-params': 'error',
            'max-statements': [
                'error',
                {
                    max: 25,
                },
            ],
            'no-alert': 'error',
            'no-array-constructor': 'error',
            'no-bitwise': 'error',
            'no-caller': 'error',
            'no-console': 'off',
            'no-constructor-return': 'error',
            'no-continue': 'error',
            'no-duplicate-imports': 'error',
            'no-else-return': 'error',
            'no-empty-function': 'error',
            'no-eq-null': 'error',
            'no-eval': 'error',
            'no-extend-native': 'error',
            'no-extra-bind': 'error',
            'no-extra-label': 'error',
            'no-implicit-coercion': 'error',
            'no-implicit-globals': 'error',
            'no-implied-eval': 'error',
            // siehe @typescript-eslint/no-invalid-this
            'no-invalid-this': 'off',
            'no-iterator': 'error',
            'no-label-var': 'error',
            'no-labels': 'error',
            'no-lone-blocks': 'error',
            'no-lonely-if': 'error',
            'no-loop-func': 'error',
            // siehe @typescript-eslint/no-loss-of-precision
            'no-loss-of-precision': 'off',
            // siehe @typescript-eslint/no-magic-numbers
            'no-magic-numbers': 'off',
            'no-multi-assign': 'error',
            'no-negated-condition': 'error',
            'no-nested-ternary': 'error',
            'no-new': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-object-constructor': 'error',
            'no-param-reassign': 'error',
            'no-promise-executor-return': 'error',
            'no-proto': 'error',
            'no-redeclare': 'off',
            // siehe @typescript-eslint/no-restricted-imports
            'no-restricted-imports': 'off',
            'no-restricted-properties': 'error',
            // https://github.com/prettier/eslint-config-prettier#no-sequences
            'no-restricted-syntax': ['error', 'SequenceExpression'],
            'no-return-assign': 'error',
            // siehe @typescript-eslint/return-await
            'no-return-await': 'off',
            'no-script-url': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            // siehe @typescript-eslint/no-shadow
            'no-shadow': 'off',
            'no-template-curly-in-string': 'error',
            // siehe @typescript-eslint/only-throw-error
            'no-throw-literal': 'off',
            'no-undef-init': 'error',
            'no-underscore-dangle': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-unneeded-ternary': 'error',
            'no-unreachable-loop': 'error',
            'no-unused-expressions': 'error',
            // siehe @typescript-eslint/no-unused-vars
            'no-unused-vars': 'off',
            'no-use-before-define': [
                'error',
                {
                    functions: false,
                    classes: false,
                },
            ],
            'no-useless-call': 'error',
            'no-useless-computed-key': 'error',
            'no-useless-concat': 'error',
            'no-useless-constructor': 'error',
            'no-useless-rename': 'error',
            'no-useless-return': 'error',
            'no-void': 'error',
            'object-shorthand': 'error',
            'one-var': ['error', 'never'],
            'operator-assignment': 'error',
            'prefer-arrow-callback': 'error',
            'prefer-exponentiation-operator': 'error',
            'prefer-numeric-literals': 'error',
            'prefer-object-has-own': 'error',
            'prefer-object-spread': 'error',
            'prefer-promise-reject-errors': 'error',
            'prefer-regex-literals': [
                'error',
                {
                    disallowRedundantWrapping: true,
                },
            ],
            'prefer-rest-params': 'error',
            'prefer-template': 'error',
            radix: 'error',
            'require-atomic-updates': 'error',
            // siehe @typescript-eslint/require-await
            'require-await': 'off',
            'require-unicode-regexp': 'error',
            // 'sort-imports': 'error',
            strict: 'error',
            'symbol-description': 'error',
            yoda: ['error', 'never'],

            // https://eslint.style/rules
            // https://eslint.style/guide/config-presets
            // https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/customize.ts
            ...stylistic.configs.customize({
                indent: 4,
                jsx: false,
            }).rules,
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/brace-style': ['error', '1tbs'],
            '@stylistic/curly-newline': 'error',
            '@stylistic/indent': 'off',
            '@stylistic/indent-binary-ops': 'off',
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    multiline: { delimiter: 'semi' },
                },
            ],
            '@stylistic/multiline-comment-style': ['error', 'separate-lines'],
            '@stylistic/operator-linebreak': 'off',
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/semi': ['error', 'always'],

            'import/consistent-type-specifier-style': [
                'error',
                'prefer-inline',
            ],
            'import/extensions': 'off',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-absolute-path': 'error',
            'import/no-commonjs': 'error',
            'import/no-cycle': 'error',
            'import/no-default-export': 'error',
            'import/no-deprecated': 'error',
            'import/no-dynamic-require': 'error',
            'import/no-empty-named-blocks': 'error',
            'import/no-extraneous-dependencies': 'error',
            'import/no-internal-modules': 'error',
            'import/no-mutable-exports': 'error',
            'import/no-named-default': 'error',
            'import/no-namespace': 'error',
            'import/no-self-import': 'error',
            'import/no-unassigned-import': 'error',
            'import/no-unresolved': 'off',
            'import/no-unused-modules': 'error',
            'import/no-useless-path-segments': 'error',
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type',
                    ],
                },
            ],
        },
    },
    {
        files: ['test/**/*.mts'],

        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.strict,
            ...tseslint.configs.stylistic,
            vitest.configs.all,
        ],

        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            parserOptions: {
                // project: true,
                ecmaFeatures: {
                    impliedStrict: true,
                },
            },
            globals: {
                ...globals.node,
            },
        },

        rules: {
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/no-explicit-any': 'off',
            // https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/src/index.ts
            // https://github.com/vitest-dev/eslint-plugin-vitest/tree/main/docs/rules
            'vitest/consistent-test-it': [
                'error',
                {
                    withinDescribe: 'test',
                },
            ],
            'vitest/max-expects': 'off',
            'vitest/no-hooks': 'off',
            'vitest/prefer-expect-assertions': 'off',
            'vitest/prefer-lowercase-title': 'off',
        },
    },

    // prettier ueberschreibt vorherige Konfigurationseinstellungen
    prettierRecommended,
);
