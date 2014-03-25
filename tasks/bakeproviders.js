var fs = require('fs');
var Tabletop = require('tabletop');

module.exports = function(grunt) {
  var multiValueDelimiter = /;\s*/; 

  function splitValues(val) {
    return val.split(multiValueDelimiter).filter(function(s) {
      return s !== "";
    });
  }

  grunt.registerMultiTask('bakeproviders', 'Bake provider list to JSON', function() {
    var done = this.async();
    var spreadsheetId = this.data.spreadsheetId;
    var outputFile = this.data.output;
    Tabletop.init({
      key: spreadsheetId,
      callback: function(data, tabletop) {
        var d;
        for (var i = 0; i < data.length; i++) {
          d = data[i];
          d.nearbus = d.nearbus.toLowerCase() === 'true' ? true : false;
          d.lowincome = d.lowincome.toLowerCase() === 'true' ? true : false;
          d.completedculturalcompetencytraining = d.completedculturalcompetencytraining.toLowerCase() === 'true' ? true : false; 
          d.type = splitValues(d.type);
          d.specialties = splitValues(d.specialties);
          d.languages = splitValues(d.languages);
        }
        fs.writeFile(outputFile, JSON.stringify(data), function(err) {
          if (err) {
            grunt.fatal(err);
          }
          else {
            done();
          }
        });
      },
      simpleSheet: true
    });
  });
};
