var fs = require('fs');
var _ = require('underscore');
var bakeProviders = require('../lib/bake');
var Github = require('github-api');

module.exports = function(grunt) {
  function writeJSON(jsonData, outputFile, done, opts) {
    fs.writeFile(outputFile, jsonData, function(err) {
      if (err) {
        grunt.fatal(err);
      }
      else {
        done();
      }
    });
  }

  function writeGithub(jsonData, outputFile, done, opts) {
    opts = opts || {};
    var defaults = {
      token: process.env.GH_TOKEN,
      username: 'workdept',
      repo: 'affirmations-referral-network',
      branch: 'master'
    };
    _.defaults(opts, defaults);

    if (!opts.token) {
      grunt.fatal("You must define the auth token in order to push the providers JSON to GitHub. The preferred way to do this is in the GH_TOKEN environment variable.");
    }

    var github = new Github({
      token: opts.token, 
      auth: "oauth"
    });
    var repo = github.getRepo(opts.username, opts.repo);
    repo.read(opts.branch, outputFile, function(err, data) {
      if (data == jsonData) {
        // No changes to data, do nothing
        done();
      }
      else {
        var msg = "Automatic update of provider JSON";
        repo.write(opts.branch, outputFile, jsonData, msg, function(err) {
          if (err) {
            grunt.fatal(err);
          }
          else {
            done();
          }
        });
      }
    });
  }

  grunt.registerMultiTask('bakeproviders', 'Bake provider list to JSON', function() {
    var done = this.async();
    var spreadsheetId = this.data.spreadsheetId;
    var outputFile = this.data.output;
    var provider = this.data.provider || 'local';

    bakeProviders(spreadsheetId, function(err, warnings, data) {
      var providersJSON = JSON.stringify(data);
      var writeFn;
      if (provider === 'github') {
        writeFn = writeGithub;
        // Write the file to the repo directly, using the GitHub API
      }
      else {
        // Write the file to the local directory
        writeFn = writeJSON;
      }

      writeFn(providersJSON, outputFile, done);
    });
  });
};
