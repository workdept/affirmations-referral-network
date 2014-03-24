(function(root, factory) {
  if (typeof exports !== 'undefined') {
    // Node.js or CommonJS
    var _ = require('underscore');
    var Backbone = require('backbone');
    factory(root, exports, _, Backbone);
  }
  else {
    // Browser globale
    root.Affirmations = factory(root, root.Affirmations || {}, root._, root.Backbone);
  }
}(this, function(root, Affirmations, _, Backbone) {
  var Provider = Backbone.Model.extend({
    idAttribute: 'rowNumber' 
  });

  var Providers = Affirmations.Providers = Backbone.Collection.extend({
    model: Provider,

    url: '/data/providers.json',

    attrOptions: function(attr) {
      this._attrOptions = this._attrOptions || {};

      if (this._attrOptions[attr]) {
        return this._attrOptions[attr];
      }
      else {
        this._attrOptions[attr] = []; 
      }

      var opts = this._attrOptions[attr];
      var seen = {};
      this.each(function(provider) {
        var val = provider.get(attr);
        if (!seen[val]) {
          seen[val] = true;
          opts.push(val);
        }
      });
      return opts;
    }
  });

  return Affirmations;
}));
