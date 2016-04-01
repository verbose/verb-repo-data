'use strict';

var fs = require('fs');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('camel-case', 'camelcase');
require('expand-pkg', 'Expand');
require('isobject', 'isObject');
require('namify');
require('repo-utils', 'repo');
require = fn;

/**
 * Returns true if `str` is a string with length greater than zero
 */

utils.isString = function(str) {
  return str && typeof str === 'string';
};

/**
 * Return true if `fp` exists on the file system
 */

utils.exists = function(fp) {
  try {
    fs.statSync(fp);
    return true;
  } catch (err) {};
  return false;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
