'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var gitty = require('gitty');
var verb = require('verb');
var del = require('delete');
var data = require('..');
var repo, app, cache;

var project = path.resolve(__dirname, 'fixtures/project');
var cwd = process.cwd();

describe('`project` variables', function() {
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

  describe('project.varname', function() {
    it('should set project.varname', function(cb) {
      app.data('project.varname', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.varname, 'xyz');
        cb();
      });
    });

    it('should set varname', function(cb) {
      app.data('project.varname', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.varname, 'xyz');
        cb();
      });
    });

    it('should get varname', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.varname, 'testProject');
        cb();
      });
    });
  });

  describe('project.alias', function() {
    it('should set project.alias', function(cb) {
      app.data('project.alias', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.alias, 'xyz');
        cb();
      });
    });

    it('should set alias', function(cb) {
      app.data('project.alias', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.alias, 'xyz');
        cb();
      });
    });

    it('should get alias', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.alias, 'test-project');
        cb();
      });
    });
  });

  describe('project.name', function() {
    it('should set project.name', function(cb) {
      app.data('project.name', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.name, 'xyz');
        cb();
      });
    });

    it('should set name', function(cb) {
      app.data('project.name', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.name, 'xyz');
        cb();
      });
    });

    it('should get name', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.name, 'test-project');
        cb();
      });
    });
  });

  describe('project.license', function() {
    it('should set license', function(cb) {
      app.data('license', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.license, 'xyz');
        cb();
      });
    });

    it('should set `project` license', function(cb) {
      app.data('project.license', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.project.license, 'xyz');
        cb();
      });
    });

    it('should get license', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.license, 'MIT');
        assert.equal(app.cache.data.licenseStatement, 'Released under the [MIT License](LICENSE).');
        cb();
      });
    });
  });
});

function render(app, cb) {
  if (!app.tests) {
    app.engine('*', require('engine-base'));
    app.create('tests');
    app.test('foo.md', {content: 'this is foo'});
  }
  app.toStream('tests')
    .pipe(app.renderFile('*'))
    .on('error', cb)
    .pipe(app.dest('test/actual'))
    .on('error', cb)
    .on('end', cb);
}
