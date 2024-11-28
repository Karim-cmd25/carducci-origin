(function ($) {
  $.fn.mauGallery = function (options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function () {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }

      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function (index) {
          $.fn.mauGallery.methods.tag($(this), $(this).data("gallery-tag"));
        });
    });
  };

  $.fn.mauGallery.listeners = function (options) {
    $(".nav-pills .nav-link").on("click", function () {
      $.fn.mauGallery.methods.filterByTag.call(this);
    });

    if (options.lightBox) {
      $(".gallery-item").on("click", function () {
        $.fn.mauGallery.methods.lightBoxShow(
          $(this).data("gallery-id"),
          options
        );
      });
    }
  };

  $.fn.mauGallery.methods = {
    filterByTag: function () {
      // Si l'élément cliqué est déjà actif, ne rien faire
      if ($(this).hasClass("active-tag")) {
        return;
      }

      // Retirer la classe active de tous les éléments
      $(".active-tag").removeClass("active-tag");

      // Ajouter la classe active au tag cliqué
      $(this).addClass("active-tag");

      var tag = $(this).data("images-toggle");

      // Afficher ou masquer les images en fonction du tag sélectionné
      $(".gallery-item").each(function () {
        $(this).parents(".item-column").hide(); // Masquer toutes les images par défaut
        if (tag === "all") {
          // Si "Tous" est sélectionné, afficher toutes les images
          $(this).parents(".item-column").show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          // Sinon, afficher les images du tag sélectionné
          $(this).parents(".item-column").show(300);
        }
      });
    },
    createRowWrapper: function ($element) {
      $element.find(".gallery-item").wrap("<div class='item-column'></div>");
    },
    createLightBox: function ($element, lightBoxId, navigation) {
      var lightBox =
        "<div id='" +
        lightBoxId +
        "' class='lightbox'>" +
        "<div class='lightbox-inner'>" +
        "<span class='mg-prev'>‹</span>" +
        "<div class='mg-wrapper'></div>" +
        "<span class='mg-next'>›</span>" +
        "</div></div>";

      $element.append(lightBox);

      // Ajout des événements de navigation si nécessaire
      if (navigation) {
        $(document).on("click", ".mg-prev", function () {
          $.fn.mauGallery.methods.navigateLightbox("prev");
        });
        $(document).on("click", ".mg-next", function () {
          $.fn.mauGallery.methods.navigateLightbox("next");
        });
      }
    },
  };
})(jQuery);
