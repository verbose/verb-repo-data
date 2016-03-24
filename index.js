'use strict';

var utils = require('./utils');

module.exports = function plugin(app, base) {
  if (!isValidInstance(app)) return;

  /**
   * Common data
   */

  app.data({year: new Date().getFullYear()});
  app.data({owner: app.data.owner || owner(app, app.pkg.data)});
  app.data({cwd: app.options.cwd || app.cwd});
  app.data(app.pkg.data);
  app.cache.data.author = expandPerson(app.data('author'), app.cwd);

  /**
   * Middleware
   */

  app.postCompile(/./, function(file, next) {
    updateContext(app, base, file, next);
  });

  /**
   * `alias` setter
   */

  setAlias(base);
  return plugin;
};

/**
 * Merge data onto the context from:
 * - the `base` instance cache
 * - answers to prompts
 * - global defaults
 */

function updateContext(app, base, file, next) {
  function merge(data, obj) {
    data = utils.merge({}, utils.omitEmpty(obj), data);
    utils.merge(data, data.project);
    return data;
  }

  var data = app.cache.data;
  if (!utils.isObject(app.data('author'))) {
    var author = base.globals.get('author');
    if (utils.isObject(author)) {
      app.data({author: author});
    }
  }

  data = merge(data, app.questions.answers);
  data = merge(data, base.cache.data);
  data = merge(data, app.cache.data);

  app.cache._context = data;
  file.data = merge(data, file.data);
  next();
}

/**
 * Create the `alias` variable for templates
 */

function setAlias(base) {
  var alias = null;
  Object.defineProperty(base.cache.data, 'alias', {
    configurable: true,
    set: function(val) {
      alias = val;
    },
    get: function() {
      if (alias) {
        return alias;
      }
      alias = camelcase(base.toAlias(base.project || path.basename(path.dirname(base.cwd))));
      return alias;
    }
  });
}

/**
 * Create `owner` variable for templates context
 */

function owner(base, pkg) {
  var repo = pkg.repository;
  if (utils.isObject(repo)) {
    repo = repo.url;
  }
  if (typeof repo === 'string') {
    var obj = utils.parseGithubUrl(repo);
    return obj.owner;
  }
  return base.data('author.username');
}

/**
 * Camelcase the given string
 */

function camelcase(str) {
  if (str.length === 1) {
    return str.toLowerCase();
  }
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase();
  return str.replace(/[\W_]+(\w|$)/g, function(_, ch) {
    return ch.toUpperCase();
  });
}

/**
 * Expand person strings into objects
 */

function expandPerson(str, cwd) {
  var person = {};
  if (Array.isArray(str)) {
    str.forEach(function(val) {
      person = utils.merge({}, person, expandPerson(val, cwd));
    });
  } else if (typeof str === 'string') {
    person = utils.merge({}, person, utils.parseAuthor(str));
  } else if (str && typeof str === 'object') {
    person = utils.merge({}, person, str);
  }
  if (!person.username && person.url && /github\.com/.test(person.url)) {
    person.username = person.url.slice(person.url.lastIndexOf('/') + 1);
  }
  if (!person.username) {
    person.username = utils.gitUserName(cwd);
  }
  if (!person.twitter && person.username) {
    person.twitter = person.username;
  }
  return utils.omitEmpty(person);
}

/**
 * Validate instance
 */

function isValidInstance(app) {
  if (!app.isApp && !app.isGenerator) {
    return false;
  }
  if (app.isRegistered('verb-data')) {
    return false;
  }
  return true;
}


/**
 * Add "Released under..." statement to license from
 * package.json.
 *
 * @param {Object} `verb`
 * @return {undefined}
 */

function formatLicense(val, config, options) {
  var opts = utils.extend({cwd: process.cwd()}, options);

  var license = val || 'MIT';
  if (/Released/.test(license)) {
    return { license: license };
  }

  var fp = path.resolve(opts.cwd, 'LICENSE');
  var statement = '';

  if (fs.existsSync(fp)) {
    var url = utils.repositoryFile(config.repository, 'LICENSE');
    license = '[' + license + ' license](' + url + ').';
  } else {
    license += ' license.';
  }
  return {
    license: 'Released under the ' + license
  };
}
