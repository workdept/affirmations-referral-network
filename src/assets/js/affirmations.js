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

  var Provider = Backbone.Model.extend({
    idAttribute: 'id' 
  });


  // Collections
  
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
        var vals;
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
          attribute: 'sex_gender_identity',
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
          attribute: 'near_bus',
          label: "Near a bus line",
          type: 'checkbox'
        },
        {
          attribute: 'completed_cultural_competency_training',
          label: "Has completed Affirmations' cultural competency training(s) for health providers",
          type: 'checkbox'
        },
        {
          attribute: 'low_income',
          label: "Offers low-income accomodations",
          type: 'checkbox'
        }
      ]
    },

    attributes: {
      id: 'filters'
    },

    initialize: function(options) {
      this._childViews = [];
      _.each(this.options.filters, function(filterOpts) {
        this._childViews.push(this._createChildView(filterOpts));
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
      _.each(this.collection.attrOptions(this.filterAttribute), function(opt) {
        var $el = $('<option>').attr('value', opt).html(opt).appendTo($select);
      }, this);
      
      return this;
    },

    change: function(evt) {
      console.debug('change');
      console.debug(this.$('select').val());
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
      console.debug('change');
      console.debug(this.$('input').prop('checked'));
    }
  });

  return Affirmations;
}));
