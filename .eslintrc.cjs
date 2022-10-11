module.exports = {
  root: true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    'plugin:vue/vue3-strongly-recommended',
    "plugin:vue/vue3-essential",
    'plugin:prettier/recommended',
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser": "@typescript-eslint/parser",
    "sourceType": "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "rules": {
    'vue/component-tags-order': [
      'error',
      {
        // order: [['script', 'template'], 'style'],
        order: ['script', 'template', 'style'],
      },
    ],
  }
}