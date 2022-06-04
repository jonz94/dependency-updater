@jonz94/dependency-updater
===

[![npm](https://img.shields.io/npm/v/@jonz94/dependency-updater.svg?style=flat-square)](https://www.npmjs.com/package/@jonz94/dependency-updater)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> still in development

A CLI tool to update dependency automatically

![demo](https://i.imgur.com/hzSsBcD.gif)

Features/TODOs
---

- ✅ Support multiple package manager
    - ✅ npm
    - ✅ pnpm
    - ✅ yarn 1
- 🚧 Choose which packages to update
    - ✅ Update all outdated packages in single run
    - 🚧 Update only some of packages
- 🚧 Git integrations
    - ✅ Add corresponding git commit messages automatically
    - 🚧 Customize git commit message format
    - 🚧 If repository is not clean, do not automatically add git commits right away
- 🚧 Support workspaces/monorepo
    - 🚧 npm 7+
    - 🚧 pnpm
    - 🚧 yarn 1

Installation
---

```
npm i -g @jonz94/dependency-updater
```

Usage
---

- Execute `dependency-updater` command inside the project root directory

```bash
dependency-updater
```

- If you don't want to install the package globally, you can use following command:

```bash
npx -p @jonz94/dependency-updater@latest dependency-updater
```
