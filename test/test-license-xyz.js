'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var gitty = require('gitty');
var verb = require('verb');
var del = require('delete');
var data = require('..');
var repo, app, cache;

var project = path.resolve(__dirname, 'fixtures/project-license-xyz');
var cwd = process.cwd();

describe('verb-data (xyz license repository)', function() {
  before(function(cb) {
    process.chdir(project);
    repo = gitty(process.cwd());
    repo.initSync();
    repo.addSync(['.']);
    repo.commitSync('first commit');
    cb();
  });

  after(function(cb) {
    process.chdir(cwd);
    del(project + '/.git', cb);
  });

  beforeEach(function() {
    app = verb();
    cache = app.store.data;
    app.store.data = {};
    app.store.save();
    app.use(data);
  });

  afterEach(function() {
    app.store.set(cache);
  });

  describe('data', function() {
    it('should add package.json data to the instance', function() {
      assert.equal(app.cache.data.name, 'test-project');
    });

    it('should update license on `cache.data`', function() {
      assert.equal(app.cache.data.license, 'Released under the [XYZ license](LICENSE).');
    });
  });
});
