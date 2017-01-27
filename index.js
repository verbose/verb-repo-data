'use strict';

var path = require('path');
var clone = require('clone-deep');
var utils = require('./utils');

module.exports = function plugin(app) {
  if (!utils.isValid(app, 'verb-repo-data')) return;

  // clone user-defined data before extending
  var data = clone(app.cache.data);

  /**
   * Plugins
   */

  app.use(require('generate-data'));

  /**
   * Format license field for readmes
   */

  app.data('licenseStatement', formatLicense(app));

  // restore user-defined data
  app.data(data);
};

/**
 * Create a license statement from `license` in from package.json
 * @param {Object} `app`
 * @param {Object} `val` License string in package.json
 * @param {Object} `config` package.json config object
 */

function formatLicense(app) {
  var license = app.options.license || app.cache.data.license || 'MIT';
  if (/^(Released|Licensed)/.test(license)) {
    return license;
  }

  var fp = path.resolve(app.cwd, 'LICENSE');
  if (utils.exists(fp)) {
    var url = utils.repo.file(app.cache.data.repo, 'LICENSE');
    license = '[' + license + ' License](LICENSE).';
  } else {
    license += ' License.';
  }
  return 'Released under the ' + license;
}
