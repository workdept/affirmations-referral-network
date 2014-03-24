var fs = require('fs');
var should = require('should');
var Affirmations = require('../src/assets/js/models.js');
var dataFile = __dirname + '/../src/data/providers.json';

describe('Providers', function() {
  var attrs;
  var providers; 

  beforeEach(function(done) {
    fs.readFile(dataFile, 'utf8', function (err, data) {
      if (err) {
        return done(err);
      }
     
      attrs = JSON.parse(data);
      providers = new Affirmations.Providers(attrs);
      done();
    });
  });

  describe('#attrOptions()', function() {
    it('returns a list of options', function() {
      var opts = providers.attrOptions('type');
      opts.length.should.equal(2);
      opts[0].should.equal('Mental health practitioner');
      opts[1].should.equal('Physician');
    });
  });

});
