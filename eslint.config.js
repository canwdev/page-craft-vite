import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,

  rules: {
    'no-console': 'off',
    'no-alert': 'off',
    'vue/no-mutating-props': 'warn',
    'ts/no-use-before-define': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'regexp/no-dupe-disjunctions': 'warn',
    'unused-imports/no-unused-vars': 'warn',
    'no-async-promise-executor': 'warn',
  },
})
