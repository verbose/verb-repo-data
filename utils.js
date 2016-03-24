'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('git-user-name');
require('isobject', 'isObject');
require('mixin-deep', 'merge');
require('omit-empty');
require('parse-author');
require('parse-github-url');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
