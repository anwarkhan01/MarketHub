export default {
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    rules: {
        'import/extensions': [
            'error',
            'always',
            {
                js: 'always',
                jsx: 'always',
            },
        ],
    },
};
