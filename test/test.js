var fs = require('fs');
var _ = require('underscore');
var should = require('should');
var sinon = require('sinon');
var Affirmations = require('../src/assets/js/affirmations.js');
var dataFile = __dirname + '/../src/data/providers.json';

describe('Provider', function() {
  var provider;

  beforeEach(function() {
    provider = new Affirmations.Provider({
      "affirmationstrainings": "", 
      "agencyname": "Emotional Freedom Techniques Services LLC", 
      "city": "Ferndale", 
      "comments": "", 
      "completedculturalcompetencytraining": false, 
      "county": "Oakland", 
      "email": "annette.richards@att.net", 
      "id": "1", 
      "insurancesaccepted": "Blue Cross Blue Shield, Fictious Company, Signa", 
      "languages": [
        "English"
      ], 
      "lowincome": true, 
      "mailingcity": "", 
      "mailingstate": "", 
      "mailingstreetaddress": "", 
      "mailingzip": "", 
      "nearbus": false, 
      "nearbybuslines": "", 
      "officehours": "Monday through Friday, 9am - 5pm", 
      "orientation": "Gay/Lesbian", 
      "phone": "(248) 334-9214", 
      "providername": "Annette Richards, LMSW", 
      "race": "White", 
      "rowNumber": 1, 
      "sexgenderidentity": "Female", 
      "specialties": [
        "Gender identity issues", 
        "Lesbian issues", 
        "Gay issues", 
        "Queer issues", 
        "Bisexual issues", 
        "Sexual assault", 
        "Intimate partner violence/domestic violence", 
        "Addiction issues", 
        "Substance abuse, Marriage/relationship issues, Family issues"
      ], 
      "state": "MI", 
      "streetaddress": "641 W. 9 Mile, Suite C", 
      "trainings": "EFT Practitioner Trainer", 
      "type": [
        "Mental Health Practitioner"
      ], 
      "website": "annetterichardseft.com", 
      "zip": "48220"
    });
  });

  describe('#matchesFacets()', function() {
    it('returns true when attributes match', function() {
      var attrs = {
        county: 'Oakland',
        type: ['Mental Health Practitioner', 'Physician'],
        specialties: ['Sexual assault', 'Addiction issues']
      };
      provider.matchesFacets(attrs).should.equal(true);
    });

    it('returns false when attributes do not match', function() {
      var attrs = {
        county: 'Oakland',
        type: ['Physician'],
        specialties: ['Sexual assault', 'Addiction issues']
      };
      provider.matchesFacets(attrs).should.equal(false);
    });
  });
});

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

  describe('#facetOptions()', function() {
    it('returns a list of options', function() {
      var opts = providers.facetOptions('type');
      opts.length.should.be.greaterThan(0);
      opts.should.containEql('Mental Health Practitioner');
      opts.should.containEql('Physician');
    });
  });

  describe('#facet()', function() {
    it('accepts multiple values', function() {
      var filterAttrs = {
        type: ['Physician', 'Mental Health Practitioner'],
        county: 'Oakland'
      };
      var filtered = providers.facet(filterAttrs);
      _.each(filtered, function(provider) {
        _.intersection(filterAttrs.type, provider.get('type')).length
          .should.be.greaterThan(0);
        provider.get('county').should.equal(filterAttrs.county);
      });
    });

    it("triggers a 'facet' event when it has been called", function() {
      var filterAttrs = {
        type: ['Physician', 'Mental Health Practitioner'],
        county: 'Oakland'
      };
      var spy = sinon.spy();
      providers.on('facet', spy);
      providers.facet(filterAttrs);
      spy.called.should.equal(true);
    });
  });

});
