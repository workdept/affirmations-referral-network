var Tabletop = require('tabletop');

var multiValueDelimiter = /;\s*/; 

function splitValues(val) {
  return val.split(multiValueDelimiter).map(function(s) {
      return s.trim();
    })
    .filter(function(s) {
      return s !== "";
    });
}

function bakeProviders(spreadsheetId, callback) {
  Tabletop.init({
    key: spreadsheetId,
    callback: function(data, tabletop) {
      var err = null;
      var warnings = null;
      for (var i = 0; i < data.length; i++) {
        d = data[i];
        if (d.nearbus !== undefined) { d.nearbus = d.nearbus.toLowerCase() === 'true' ? true : false;}
        if (d.nearbybuslines !==undefined) { d.nearbybuslines = splitValues(d.nearbybuslines);}
        if (d.lowincome !==undefined) { d.lowincome = d.lowincome.toLowerCase() === 'true' ? true : false;}
        if (d.completedculturalcompetencytraining !==undefined) { d.completedculturalcompetencytraining = d.completedculturalcompetencytraining.toLowerCase() === 'true' ? true : false;} 
        if (d.type !==undefined) { d.type = splitValues(d.type);}
        if (d.specialties !==undefined) { d.specialties = splitValues(d.specialties);}
        if (d.languages !==undefined) { d.languages = splitValues(d.languages);}
        if (d.county !==undefined) { d.county = splitValues(d.county);}
        if (d.orientation !==undefined) { d.orientation = splitValues(d.orientation);}
        if (d.sexgenderidentity !==undefined) { d.sexgenderidentity = splitValues(d.sexgenderidentity);}
        if (d.race !==undefined) { d.race = splitValues(d.race);}
        if (d.affirmationstrainings !==undefined) { d.affirmationstrainings = splitValues(d.affirmationstrainings);}
      }
      callback(err, warnings, data); 
    },
    simpleSheet: true
  });
}

module.exports = bakeProviders;
