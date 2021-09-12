module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier',
    'plugin:cypress/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    "vue/valid-v-slot": ["error", {
      "allowModifiers": true
    }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"]
  }
}
