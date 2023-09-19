/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,

  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-organize-imports'],

  overrides: [
    {
      files: '**/*.json',
      options: {
        printWidth: 1,
      },
    },
  ],
}

export default config
