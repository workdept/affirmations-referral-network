(function(root, $, _, Backbone, Affirmations) {
  function toggleOffcanvas() {
    $('body').toggleClass('offcanvas-show');
  }

  $('.navbar-toggle').click(toggleOffcanvas);
  var AFFIRMATIONS_PROVIDERS_JSON_URL = 'data/providers.json';
  var providers = new Affirmations.Providers();
  var filtersView = new Affirmations.FiltersView({
    collection: providers
  });
  var listView = new Affirmations.ProviderListView({
    collection: providers,
    el: $('#providers')
  });
  var countView = new Affirmations.ProviderCountView({
    collection: providers
  });
  $('#offcanvas-sidebar').append(countView.$el);
  $('#offcanvas-sidebar').append(filtersView.$el);
  countView.$el.click(toggleOffcanvas);
  providers.url = 'data/providers.json';
  providers.fetch();
})(this, jQuery, _, Backbone, Affirmations);
