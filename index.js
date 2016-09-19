'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function plugin(app, base) {
  if (!utils.isValid(app, 'verb-repo-data')) return;

  /**
   * Plugins
   */

  app.use(require('generate-data'));

  /**
   * Format license field for readmes
   */

  app.data('license', formatLicense(app));
};

/**
 * Create a license statement from `license` in from package.json
 * @param {Object} `app`
 * @param {Object} `val` License string in package.json
 * @param {Object} `config` package.json config object
 */

function formatLicense(app) {
  var license = app.options.license || app.data.license || 'MIT';
  if (/^(Released|Licensed)/.test(license)) {
    return license;
  }

  var fp = path.resolve(app.cwd, 'LICENSE');
  if (utils.exists(fp)) {
    var url = utils.repo.file(app.cache.data.repo, 'LICENSE');
    license = '[' + license + ' license](LICENSE).';
  } else {
    license += ' license.';
  }
  return 'Released under the ' + license;
}
