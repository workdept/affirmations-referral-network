(function(root, $, _, Backbone, Affirmations) {
  var $filtersContainer = $('#filters-container');
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
  var searchView = new Affirmations.SearchView({
    collection: providers
  });
  $('#providers').addClass('summary');
  $filtersContainer.append(countView.$el);
  $filtersContainer.append(searchView.render().$el);
  $filtersContainer.append(filtersView.$el);
  providers.url = 'data/providers.json';
  providers.fetch();
})(this, jQuery, _, Backbone, Affirmations);
