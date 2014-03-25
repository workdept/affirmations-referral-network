(function(root, $, _, Backbone, Affirmations) {
  $('.navbar-toggle').click(function() {
    $('body').toggleClass('offcanvas-show');
  });
  var AFFIRMATIONS_PROVIDERS_JSON_URL = 'data/providers.json';
  var providers = new Affirmations.Providers();
  providers.url = 'data/providers.json';
  var filtersView = new Affirmations.FiltersView({
    collection: providers
  });
  $('#offcanvas-sidebar').append(filtersView.$el);
  providers.fetch();
})(this, jQuery, _, Backbone, Affirmations);
