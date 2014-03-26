(function(root, $, _, Backbone, Affirmations) {
  $('.navbar-toggle').click(function() {
    $('body').toggleClass('offcanvas-show');
  });
  var AFFIRMATIONS_PROVIDERS_JSON_URL = 'data/providers.json';
  var providers = new Affirmations.Providers();
  var filtersView = new Affirmations.FiltersView({
    collection: providers
  });
  var listView = new Affirmations.ProviderListView({
    collection: providers,
    el: $('#providers')
  });
  $('#offcanvas-sidebar').append(filtersView.$el);
  providers.url = 'data/providers.json';
  providers.fetch();
})(this, jQuery, _, Backbone, Affirmations);
