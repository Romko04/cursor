if(typeof Drupal!=="undefined"&&typeof jQuery!=="undefined"){(function(e){Drupal.behaviors.picture={attach:function(t){if(!("HTMLPictureElement"in window)){var n=e(t).find("img");if(n.length){window.picturefill({elements:n.get()})}}if(t==="#cboxLoadedContent"&&e(t).find("picture").length){e.colorbox.resize();e("img",t).once("colorbox-lazy-load",function(){e(this).load(function(){this.style.maxHeight=e(window).height()+"px";this.style.maxWidth=e(window).width()+"px";e.colorbox.resize({innerHeight:this.height,innerWidth:this.width});this.style.maxHeight=null;this.style.maxWidth=null})})}}}})(jQuery)}
;/**/
