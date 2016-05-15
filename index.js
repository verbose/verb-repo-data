'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function plugin(app, base) {
  if (!isValidInstance(app)) return;

  var config = new utils.Expand(app.options)
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
    .field('alias', 'string', {
      normalize: function(val, key, config, schema) {
        var data = app.cache.data || {};
        var toAlias = schema.options.toAlias;
        if (typeof toAlias === 'function') {
          val = config[key] = toAlias.call(data, data.name);
          return val;
        }
        var seg = data.name.slice(data.name.lastIndexOf('-') + 1);
        return utils.camelcase(seg);
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
  var project = {};

  Object.defineProperty(app.cache.data, 'project', {
    set: function(val) {
      utils.merge(project, val);
    },
    get: function() {
      utils.merge(project, app.cache.data);
      return project;
    }
  });
  return plugin;
};

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
  if (typeof app.data !== 'function') {
    throw new Error('expected the base-data plugin to be registered');
  }
  if (app.isRegistered('verb-repo-data')) {
    return false;
  }
  return true;
}

