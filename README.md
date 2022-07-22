# heusalagroup/fi.hg.frontend

Our enterprise frontend library for TypeScript.

### It doesn't have many runtime dependencies

### We don't have traditional releases

We don't have traditional releases.  This project evolves directly to our git repository in an agile manner.

This git repository contains only the source code for a compile time use case. It is meant to be used as a git submodule in a NodeJS or webpack project.

See also [hg.fi](https://hg.fi) for easy NPM package creators for your project and other additional modules from us.

### License

Copyright (c) Heusala Group. All rights reserved. Licensed under the MIT License (the "[License](./LICENSE)");

## Install & maintain our library

Run the installation commands from your project's root directory. Usually it's where your `package.json` is located.

For these sample commands we expect your source files to be located in `./src` and we'll use `./src/fi/hg/frontend` for location for our submodule.

Setup git submodule:

```shell
mkdir -p src/fi/hg
git submodule add git@github.com:heusalagroup/fi.hg.frontend.git src/fi/hg/frontend
git config -f .gitmodules submodule.src/fi/hg/frontend.branch main
```

Next install our required dependencies (newest [lodash library](https://lodash.com/) and [reflect-metadata library](https://www.npmjs.com/package/reflect-metadata)):

```shell
git submodule add git@github.com:heusalagroup/fi.hg.core.git src/fi/hg/core
git config -f .gitmodules submodule.src/fi/hg/core.branch main
npm i --save-dev lodash @types/lodash 'moment-timezone' '@types/moment-timezone'
```

### Checking out a project with git submodules

Git doesn't automatically clone your sub modules.

You'll need to command:

```shell
git clone --recurse-submodules git@github.com:heusalagroup/your-project.git your-project
```

...or:

```shell
git clone git@github.com:heusalagroup/your-project.git your-project
cd your-project
git submodule init
git submodule update
```

### Updating upstream library code

Later when you want to update your submodules, you may do:

```shell
git pull
git submodule update --remote
```

### Why git submodules, you may wonder?

NPM doesn't provide a good way to implement pure compile time TypeScript libraries.

We would have to compile our whole library in our bundle even though you probably don't use everything.

It wouldn't be possible to use compile time optimizations and other ENV based feature flags.
