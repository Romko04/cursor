(function ($) {

// Lifted from http://drupal.org/node/269250#comment-3879464

// Pushed this init into drupal behaviours to ensure it runs 
// AFTER imce has bootstrapped
Drupal.behaviors.imce_prettyfiles = {
  attach: function (context, settings) {
    
    if (window.imce) {
      // Runs when imce loads
      imce.hooks.load.push(function() {
        // Override base file URL. This was probably something like '/sites/domain/files/'
        imce.conf.furl = '/files/';
        // Or you can override imce.getURL() method that generates file URLs
      });
    }


  }}

})(jQuery);
;
