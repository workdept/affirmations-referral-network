var Tabletop = require('tabletop');

var multiValueDelimiter = /;\s*/; 

function splitValues(val) {
  return val.split(multiValueDelimiter).filter(function(s) {
    return s !== "";
  });
}

function bakeProviders(spreadsheetId, callback) {
  Tabletop.init({
    key: spreadsheetId,
    callback: function(data, tabletop) {
      var err = null;
      var warnings = null;
      var d;
      for (var i = 0; i < data.length; i++) {
        d = data[i];
        d.nearbus = d.nearbus.toLowerCase() === 'true' ? true : false;
        d.nearbybuslines = splitValues(d.nearbybuslines);
        d.lowincome = d.lowincome.toLowerCase() === 'true' ? true : false;
        d.completedculturalcompetencytraining = d.completedculturalcompetencytraining.toLowerCase() === 'true' ? true : false; 
        d.type = splitValues(d.type);
        d.specialties = splitValues(d.specialties);
        d.languages = splitValues(d.languages);
        d.county = splitValues(d.county);
        d.orientation = splitValues(d.orientation);
        d.sexgenderidentity = splitValues(d.sexgenderidentity);
        d.race = splitValues(d.race);
        d.affirmationstrainings = splitValues(d.affirmationstrainings);
      }
      callback(err, warnings, data); 
    },
    simpleSheet: true
  });
}

module.exports = bakeProviders;
