(function(root, $, _, Backbone, Affirmations) {
  var $filtersContainer = $('#filters-container');
  var providers = new Affirmations.Providers();
  var filtersView = new Affirmations.FiltersView({
    collection: providers
  });
  var listView = new Affirmations.ProviderListView({
    collection: providers,
    el: $('#providers')
  });
  var searchView = new Affirmations.SearchView({
    collection: providers
  });
  var router = new Affirmations.Router();
  var $filtersBtn = $('<button>')
    .addClass('btn btn-default')
    .html('Filter providers')
    .click(function(evt) {
      evt.preventDefault();
      router.navigate('', {trigger: true});
    });
  var $providersBtn = $('<button>')
    .addClass('btn btn-default')
    .html('Return to providers list')
    .click(function(evt) {
      evt.preventDefault();
      router.navigate('providers', {trigger: true});
    });


  $('#navbar-collapse-main').append(searchView.render().$el);
  $filtersContainer.append(filtersView.$el);
  providers.url = 'data/providers.json';
  providers.fetch();

  listView.$el.hide();
  $('#providers').before($filtersBtn);
  $('#providers').before($providersBtn.hide());

  filtersView.on('showproviders', function() {
    router.navigate('providers', {trigger: true});
  });

  searchView.on('search', function() {
    router.navigate('providers', {trigger: true});
  });

  router.on('route:providers', function() {
    window.scrollTo(0, 0);
    listView.showList();
    listView.$el.show();
    $providersBtn.hide();
    $filtersBtn.show();
    $filtersContainer.hide();
  });

  router.on('route:providerDetail', function(id) {
    window.scrollTo(0, 0);
    $filtersBtn.hide();
    listView.showDetail(id);
    listView.$el.show();
    $providersBtn.show();
    $filtersContainer.hide();
  });

  router.on('route:index', function() {
    window.scrollTo(0, 0);
    listView.$el.hide();
    $filtersBtn.hide();
    $filtersContainer.show();
  });

  Backbone.history.start({});
})(this, jQuery, _, Backbone, Affirmations);
