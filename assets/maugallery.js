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
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };

  $.fn.mauGallery.listeners = function (options) {
    $(".gallery-item").on("click", function () {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };

  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },

    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },

    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },

    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },

    prevImage() {
      let activeImage = $(".lightboxImage").attr("src"); // Image actuellement affichée
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle"); // Tag actif
      let imagesCollection = [];

      // Récupération des images visibles en fonction du tag actif
      if (activeTag === "all") {
        $(".item-column img").each(function () {
          imagesCollection.push($(this));
        });
      } else {
        $(".item-column img").each(function () {
          if ($(this).data("gallery-tag") === activeTag) {
            imagesCollection.push($(this));
          }
        });
      }

      // Trouver l'index de l'image active
      let index = imagesCollection.findIndex(
        (img) => $(img).attr("src") === activeImage
      );
      // Si l'index est > 0, afficher l'image précédente
      if (index > 0) {
        $(".lightboxImage").attr(
          "src",
          $(imagesCollection[index - 1]).attr("src")
        );
      } else {
        // Si index est 0, afficher la dernière image
        $(".lightboxImage").attr(
          "src",
          $(imagesCollection[imagesCollection.length - 1]).attr("src")
        );
      }
    },

    nextImage() {
      let activeImage = $(".lightboxImage").attr("src"); // Image actuellement affichée
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle"); // Tag actif
      let imagesCollection = [];

      // Récupération des images visibles en fonction du tag actif
      if (activeTag === "all") {
        $(".item-column img").each(function () {
          imagesCollection.push($(this));
        });
      } else {
        $(".item-column img").each(function () {
          if ($(this).data("gallery-tag") === activeTag) {
            imagesCollection.push($(this));
          }
        });
      }

      // Trouver l'index de l'image active
      let index = imagesCollection.findIndex(
        (img) => $(img).attr("src") === activeImage
      );
      // Si l'index est < imagesCollection.length - 1, afficher l'image suivante
      if (index < imagesCollection.length - 1) {
        $(".lightboxImage").attr(
          "src",
          $(imagesCollection[index + 1]).attr("src")
        );
      } else {
        // Sinon, afficher la première image
        $(".lightboxImage").attr("src", $(imagesCollection[0]).attr("src"));
      }
    },

    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },

    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function (index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },

    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return; // Si le tag est déjà actif, ne rien faire
      }

      // Retirer la classe active de l'ancien élément et réinitialiser le fond
      $(".active-tag").removeClass("active-tag").css("background-color", "");

      // Ajouter la classe active au nouveau tag sélectionné et changer son fond
      $(this).addClass("active-tag").css("background-color", "gold");

      var tag = $(this).data("images-toggle");

      // Afficher ou masquer les images en fonction du tag sélectionné
      $(".gallery-item").each(function () {
        $(this).parents(".item-column").hide();
        if (tag === "all") {
          $(this).parents(".item-column").show(300); // Afficher toutes les images
        } else if ($(this).data("gallery-tag") === tag) {
          $(this).parents(".item-column").show(300); // Afficher les images avec le tag sélectionné
        }
      });
    },
  };

  // Ajouter le CSS pour le fond doré à la catégorie active
  $("<style>")
    .prop("type", "text/css")
    .html(
      `
      .nav-link.active-tag {
        background-color: gold !important; /* Appliquer un fond doré à l'élément actif */
      }
    `
    )
    .appendTo("head");
})(jQuery);
