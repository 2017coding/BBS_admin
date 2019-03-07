// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "indent": ["error", 2],
    "no-useless-escape": "off", // 对不必要的转义字符不验证
    "prefer-promise-reject-errors": "off", // promise的reject不为错误
    "one-var": ["error", {var: "consecutive", let: "consecutive", const: "consecutive"}], // 设置val, let, const可以连续声明多个并且可以赋值或者不赋值
    // 取消意想不到的制表符提示
    "no-tabs": "off"
  }
}
