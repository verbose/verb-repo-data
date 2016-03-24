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

describe('verb-data', function() {
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
    console.log(cache);
    app.store.data = {};
    app.store.save();
  });

  afterEach(function() {
    app.store.set(cache);
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

  describe('generator', function() {
    it('should add data to a generator', function(cb) {
      app.use(data);

      app.generator('foo', function(foo) {
        cb();
      });
    });

    it('should add data from a generator to a sub-generator', function(cb) {
      app.use(data);

      app.generator('foo', function(foo) {
        cb();
      });
    });

    it('should add data to a sub-generator', function(cb) {
      app.generator('foo', function(foo) {
        foo.use(data);

        cb();
      });
    });

    it('should extend to a nested sub-generator', function(cb) {
      app.generator('foo', function(foo) {
        foo.use(data);
        cb();
      });
    });
  });

  describe('context', function() {
    it('should add data to the context before rendering', function(cb) {
      app.generator('foo', function(app) {
        app.extendWith(data);
        app.engine('*', require('engine-base'));
        app.create('files');

        app.preWrite(/./, function(file, next) {
          // console.log(file.data);
          next();
        });

        app.task('render', function(cb) {
          app.file('foo.md', {content: 'this is foo'});

          app.toStream('files')
            .pipe(app.renderFile('*'))
            .pipe(app.dest('test/actual'))
            .on('end', cb);
        });

        app.build('render', function(err) {
          if (err) return cb(err);

          cb();
        });
      });
    });
  });
});
