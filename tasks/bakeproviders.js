var fs = require('fs');
var bakeProviders = require('../lib/bake');

module.exports = function(grunt) {
  grunt.registerMultiTask('bakeproviders', 'Bake provider list to JSON', function() {
    var done = this.async();
    var spreadsheetId = this.data.spreadsheetId;
    var outputFile = this.data.output;

    bakeProviders(spreadsheetId, function(err, warnings, data) {
      fs.writeFile(outputFile, JSON.stringify(data), function(err) {
        if (err) {
          grunt.fatal(err);
        }
        else {
          done();
        }
      });
    });
  });
};
