module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // 对为定义的变量可以使用typeof
    "no-undef": ["error", { "typeof": false }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "indent": ["error", 2],
    "no-useless-escape": "off", // 对不必要的转义字符不验证
    "prefer-promise-reject-errors": "off", // promise的reject不为错误
    // "one-var": ["error", {var: "consecutive", let: "consecutive", const: "consecutive"}], // 设置val, let, const可以连续声明多个并且可以赋值或者不赋值
    "one-var": "off",
    // 取消意想不到的制表符提示
    "no-tabs": "off"
  }
}
