'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var gitty = require('gitty');
var verb = require('verb');
var del = require('delete');
var data = require('..');
var repo, app;

var project = path.resolve(__dirname, 'fixtures/project-no-git');
var cwd = process.cwd();

describe('verb-data (no git repository)', function() {
  before(function() {
    process.chdir(project);
  });

  after(function() {
    process.chdir(cwd);
  });

  beforeEach(function() {
    app = verb();
  });

  describe('plugin', function() {
    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'verb-data') {
          count++;
        }
      });
      app.use(data);
      app.use(data);
      app.use(data);
      assert.equal(count, 1);
      cb();
    });
  });

  describe('data', function() {
    it('should add package.json data to the instance', function() {
      app.use(data);
      assert.equal(app.cache.data.name, 'test-project');
    });

    it('should work with extendWith', function() {
      app.extendWith(data);
      assert.equal(app.cache.data.name, 'test-project');
    });

    it('should add a `runner` property with verb pkg data', function() {
      app.use(data);
      assert(app.cache.data.runner);
      assert.equal(app.cache.data.runner.name, 'verb');
    });
  });
});
