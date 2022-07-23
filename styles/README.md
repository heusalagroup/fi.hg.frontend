# @heusalagroup/fi.hg.ui.styles

Our enterprise library for ReactJS UI elements.

We will release our UI related components here as compile style library.

For now this repository is mostly for [issue tracking](https://github.com/heusalagroup/fi.hg.ui/issues) and demo purposes.

### It doesn't have many runtime dependencies (if any)

This library expects some of our libraries to exist in relative paths:

 * [@heusalagroup/fi.hg.core](https://github.com/heusalagroup/fi.hg.core) to be located in the relative path `../../ts`
 * [@heusalagroup/fi.hg.ui.services](https://github.com/heusalagroup/fi.hg.ui.services) to be located in the relative path `../services`

The only 3rd party dependency we have is for [Lodash library](https://lodash.com/).

### We don't have traditional releases

This project evolves directly to our git repository in an agile manner.

This git repository contains only the source code for compile time use case. It is meant to be used as a git submodule 
in a NodeJS or webpack project.

Recommended way to initialize your project is like this:

```
mkdir -p src/fi/hg/ui

git submodule add git@github.com:heusalagroup/fi.hg.core.git src/fi/hg/core
git config -f .gitmodules submodule.src/fi/hg/core.branch main

git submodule add git@github.com:heusalagroup/fi.hg.ui.services.git src/fi/hg/ui/services
git config -f .gitmodules submodule.src/fi/hg/ui/services.branch main

git submodule add git@github.com:heusalagroup/fi.hg.ui.styles.git src/fi/hg/ui/styles
git config -f .gitmodules submodule.src/fi/hg/ui/styles.branch main

git submodule add git@github.com:heusalagroup/fi.hg.ui.components.git src/fi/hg/ui/components
git config -f .gitmodules submodule.src/fi/hg/ui/components.branch main
```

Only required dependency is to [the Lodash library](https://lodash.com/):

```
npm install --save-dev lodash @types/lodash
```

Some of our code may use reflect metadata. It's optional otherwise.

```
npm install --save-dev reflect-metadata
```

### License

Copyright (c) Heusala Group. All rights reserved. Licensed under the MIT License (the "[License](src/fi/hg/frontend/styles/LICENSE)");

### Commercial support

For commercial support check [Sendanor's organization page](https://github.com/sendanor).
