import uniHelper from '@uni-helper/eslint-config'

export default uniHelper({
  unocss: true,
  vue: true,
  markdown: false,
  ignores: [
    '**/uni_modules/',
    'nativeplugins',
    'dist',
    'manifest.json',
    'pages.json',
    'src/utils/xiaoya.ts'
  ],
  rules: {
    'style/indent': 'off',
    // 关闭末尾逗号
    'style/comma-dangle': ['error', 'never'],
    // 关闭嵌套文本必须换行
    'vue/singleline-html-element-content-newline': 'off',
    // 每个html标签最多5个属性,超出强制换行
    'vue/max-attributes-per-line': 'off',
    // 关闭tony老师的if return必须换行
    'antfu/if-newline': 'off',
    // 关闭文件末尾必须空格
    'style/eol-last': 'off',
    // 允许console存在
    'no-console': 'off',
    // 关闭jsonc
    'jsonc/sort-keys': 'off',
    'jsonc/indent': 'off',
    'jsonc/key-spacing': 'off',
    'style/no-tabs': 'off',
    'style/no-trailing-spaces': 'off',
    // if else换行
    'style/brace-style': 'off',
    // 以下这些严格来说算错误,但是太多了
    'unicorn/prefer-number-properties': 'off',
    // 'unused-imports/no-unused-vars': 'off',
    'vue/valid-v-model': 'off',
    'vue/valid-v-for': 'off',
    'no-case-declarations': 'off',
    'prefer-promise-reject-errors': 'off',
    'style/no-mixed-spaces-and-tabs': 'off',
    'prefer-rest-params': 'off',
    // 格式关闭
    'vue/html-indent': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'style/indent-binary-ops': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'e18e/prefer-static-regex': 'off'
  }
})
