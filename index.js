'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function plugin(app, base) {
  if (!isValidInstance(app)) return;

  var config = new utils.Expand(app.options);
  var author = config.schema.get('author');

  config
    .field('author', author.types, {
      normalize: function(val, key, config, schema) {
        val = author.normalize.apply(author, arguments);
        if (typeof val === 'undefined') {
          val = config[key] = app.globals.get('author');
        }
        return val;
      }
    })
    .field('username', 'string', {
      normalize: function(val, key, config, schema) {
        if (utils.isString(val)) return val;
        if (typeof val === 'undefined') {
          schema.update('author', config);
          config.author = config.author || {};
        }

        val = config[key] = utils.repo.username(config, schema.options);
        if (utils.isString(val)) {
          config.author.username = val;
          return val;
        }
      }
    })
    .field('twitter', 'string', {
      normalize: function(val, key, config, schema) {
        if (utils.isString(val)) return val;
        if (typeof val === 'undefined') {
          schema.update('username', config);
        }
        config.author = config.author || {};
        val = schema.options.twitter || config.author.username;
        if (utils.isString(val)) {
          config.author.twitter = val;
          return val;
        }
      }
    })
    .field('license', 'string', {
      normalize: function(val, key, config, schema) {
        return formatLicense(app, val, config);
      }
    })
    .field('varname', 'string', {
      normalize: function(val, key, config, schema) {
        if (utils.isString(val)) {
          return val;
        }
        var name = config.name;
        if (typeof schema.options.varname === 'function') {
          return schema.option.varname(name, config);
        }
        return utils.namify(name);
      }
    });

  /**
   * Common data
   */

  app.data({cwd: app.cwd});
  app.data({year: new Date().getFullYear()});
  app.data(app.pkg.data);
  app.data(config.expand(app.cache.data));
  setAlias(app.cache.data, app.options);
  return plugin;
};

/**
 * Create the `alias` variable for templates
 */

function setAlias(data, options) {
  var alias = null;
  Object.defineProperty(data, 'alias', {
    configurable: true,
    set: function(val) {
      alias = val;
    },
    get: function() {
      if (alias) return alias;

      var toAlias = options.toAlias;
      if (typeof toAlias === 'function') {
        return toAlias.call(data, data.name);
      }
      var val = data.name.slice(data.name.lastIndexOf('-') + 1);
      alias = utils.camelcase(val);
      return alias;
    }
  });
}

/**
 * Create a license statement from `license` in from package.json
 * @param {Object} `app`
 * @param {Object} `val` License string in package.json
 * @param {Object} `config` package.json config object
 */

function formatLicense(app, val, config) {
  var license = app.options.license || app.data.license || 'MIT';
  if (/^(Released|Licensed)/.test(license)) {
    return license;
  }

  var fp = path.resolve(app.cwd, 'LICENSE');
  if (utils.exists(fp)) {
    var url = utils.repo.file(config, 'LICENSE');
    license = '[' + license + ' license](' + url + ').';
  } else {
    license += ' license.';
  }
  return 'Released under the ' + license;
}

/**
 * Validate instance
 */

function isValidInstance(app, fn) {
  fn = fn || app.options.validatePlugin;
  if (typeof fn === 'function' && !fn(app)) {
    return false;
  }
  if (!app.isApp && !app.isGenerator) {
    return false;
  }
  if (app.isRegistered('verb-data')) {
    return false;
  }
  return true;
}

