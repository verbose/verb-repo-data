# verb-repo-data [![NPM version](https://img.shields.io/npm/v/verb-repo-data.svg?style=flat)](https://www.npmjs.com/package/verb-repo-data) [![NPM downloads](https://img.shields.io/npm/dm/verb-repo-data.svg?style=flat)](https://npmjs.org/package/verb-repo-data) [![Build Status](https://img.shields.io/travis/verbose/verb-repo-data.svg?style=flat)](https://travis-ci.org/verbose/verb-repo-data)

Verb plugin that repository and package.json data to the context for rendering templates.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install verb-repo-data --save
```

## Usage

```js
var data = require('verb-repo-data');

// use the plugin
app.use(data());
```

## Related projects

You might also be interested in these projects:

* [assemble](https://www.npmjs.com/package/assemble): Assemble is a powerful, extendable and easy to use static site generator for node.js. Used… [more](https://www.npmjs.com/package/assemble) | [homepage](https://github.com/assemble/assemble)
* [generate](https://www.npmjs.com/package/generate): Fast, composable, highly extendable project generator with a user-friendly and expressive API. | [homepage](https://github.com/generate/generate)
* [verb-readme-generator](https://www.npmjs.com/package/verb-readme-generator): Generate your project's readme with verb. Requires verb v0.9.0 or higher. | [homepage](https://github.com/verbose/verb-readme-generator)
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/verbose/verb-repo-data/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/verbose/verb-repo-data/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on April 28, 2016._