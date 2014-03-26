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
  // Models

  var Provider = Affirmations.Provider = Backbone.Model.extend({
    idAttribute: 'id',

    matchesFacets: function(attrs) {
      var attr;
      var val;
      var intersect;
      var thisVal;

      for (attr in attrs) {
        val = attrs[attr];
        thisVal = this.get(attr);

        if (_.isArray(val)) {
          if (!_.isArray(thisVal)) {
            thisVal = [thisVal];
          }
          intersect = _.intersection(val, thisVal);
          if (intersect.length === 0) {
            return false;
          }
        }
        else {
          if (val !== thisVal) {
            return false;
          }
        }
      }

      return true;
    }
  });


  // Collections
  
  var Providers = Affirmations.Providers = Backbone.Collection.extend({
    model: Provider,

    url: '/data/providers.json',

    facetOptions: function(attr) {
      this._facetOptions = this._facetOptions || {};

      if (this._facetOptions[attr]) {
        return this._facetOptions[attr];
      }
      else {
        this._facetOptions[attr] = []; 
      }

      var opts = this._facetOptions[attr];
      var seen = {};
      this.each(function(provider) {
        var val = provider.get(attr);
        var vals;

        if (val === '') {
          return;
        }

        if (_.isArray(val)) {
          vals = val;
        }
        else {
          vals = [val];
        }

        _.each(vals, function(val) {
          if (!seen[val]) {
            seen[val] = true;
            opts.push(val);
          }
        });
      }, this);

      return opts;
    },

    facet: function(attrs) {
      this._faceted = this.filter(function(provider) {
        return provider.matchesFacets(attrs);
      }, this);
      this.trigger('facet', this._faceted);
      return this._faceted;
    }
  });


  // Views
  

  var FiltersView = Affirmations.FiltersView = Backbone.View.extend({
    tagName: 'form',

    options: {
      filters: [
        {
          attribute: 'type',
          label: "Provider type",
          type: 'select'
        },
        {
          attribute: 'specialties',
          label: "Other specialties and sensitivities",
          type: 'select'
        },
        {
          attribute: 'county',
          label: "County",
          type: 'select'
        },
        {
          attribute: 'orientation',
          label: "Sexual/attractional orientation of provider",
          type: 'select'
        },
        {
          attribute: 'sexgenderidentity',
          label: "Sex/gender identity of provider",
          type: 'select'
        },
        {
          attribute: 'race',
          label: "Race/ethnicity identity of provider",
          type: 'select'
        },
        {
          attribute: 'languages',
          label: "Languages spoken",
          type: 'select'
        },
        {
          attribute: 'nearbus',
          label: "Near a bus line",
          type: 'checkbox'
        },
        {
          attribute: 'completedculturalcompetencytraining',
          label: "Has completed Affirmations' cultural competency training(s) for health providers",
          type: 'checkbox'
        },
        {
          attribute: 'lowincome',
          label: "Offers low-income accomodations",
          type: 'checkbox'
        }
      ]
    },

    attributes: {
      id: 'filters'
    },

    initialize: function(options) {
      this._filters = {};
      this._childViews = [];
      _.each(this.options.filters, function(filterOpts) {
        var view = this._createChildView(filterOpts);
        this.listenTo(view, 'change', this.handleChange, this);
        this._childViews.push(view);
      }, this);

      this.collection.on('sync', this.render, this);
    },

    _createChildView: function(options) {
      var opts = {
        filterAttribute: options.attribute,
        label: options.label,
        placeholder: options.placeholder,
        collection: this.collection
      };

      if (options.type === 'checkbox') {
        return new CheckboxFilterView(opts);
      }
      else {
        return new SelectFilterView(opts);
      }
    },

    render: function(options) {
      _.each(this._childViews, function(view) {
        this.$el.append(view.render().$el);
      }, this);
      return this;
    },

    handleChange: function(attr, val) {
      if (!val) {
        delete this._filters[attr];
      }
      else {
        this._filters[attr] = val;
      }
      this.collection.facet(this._filters);
    }
  });

  var FilterView = Backbone.View.extend({
    initialize: function(options) {
      this.filterAttribute = options.filterAttribute;
      this.label = options.label;
    }
  });
  
  var SelectFilterView = FilterView.extend({
    attributes: {
      class: 'form-group'
    },

    events: {
      'change select': 'change'
    },

    render: function() {
      this.$('option').remove();
      $('<label>').attr('for', this.filterAttribute).html(this.label)
        .appendTo(this.$el);
      $('<select>').attr('id', this.filterAttribute)
        .attr('multiple', 'multiple')
        .addClass('form-control')
        .appendTo(this.$el);
      this.renderSelect();
      return this;
    },

    renderSelect: function() {
      var $select = this.$('select');
      var placeholder = this.placeholder || "Select an option";

      $select.find('option').remove();
      //$select.append('<option value="" disabled selected>' + placeholder + '</option>');
      _.each(this.collection.facetOptions(this.filterAttribute), function(opt) {
        var $el = $('<option>').attr('value', opt).html(opt).appendTo($select);
      }, this);
      
      return this;
    },

    change: function(evt) {
      var val = this.$('select').val();
      this.trigger('change', this.filterAttribute, val);
    }
  });

  var CheckboxFilterView = FilterView.extend({
    attributes: {
      class: 'checkbox'
    },

    events: {
      'change input': 'change'
    },

    render: function() {
      var $label = $('<label>');
      $label.html(this.label);
      $('<input type="checkbox">').attr('value', this.filterAttribute)
        .attr('id', this.filterAttribute)
        .prependTo($label);
      this.$el.append($label);
      return this;
    },

    change: function(evt) {
      var val = this.$('input').prop('checked');
      this.trigger('change', this.filterAttribute, val); 
    }
  });

  var ProviderListView = Affirmations.ProviderListView = Backbone.View.extend({
    initialize: function(options) {
      this.collection.on('facet', this.handleFacet, this);
    },

    handleFacet: function(providers) {
      var map = {};
      _.each(providers, function(provider) {
        map[provider.id] = true;
      });
      this.$providers().each(function() {
        var $el = $(this);
        var id = $el.data('id');
        $el.toggle(map[id] || false);
      });
    },

    $providers: function() {
      return this.$('.provider');
    }
  });

  return Affirmations;
}));
