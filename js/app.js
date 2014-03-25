(function(root, $, _, Backbone, Affirmations) {
  $('.navbar-toggle').click(function() {
    $('body').toggleClass('offcanvas-show');
  });
  var AFFIRMATIONS_PROVIDERS_JSON_URL = 'data/providers.json';
  var providers = new Affirmations.Providers();
  providers.url = 'data/providers.json';
  
  providers.on('sync', function() {
    var filter = new Affirmations.SelectFilterView({
      el: $('select#type'),
      collection: providers
    });
    filter.render();
  });
  providers.fetch();
})(this, jQuery, _, Backbone, Affirmations);
