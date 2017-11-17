document.addEventListener('DOMContentLoaded', function() {
  svg4everybody();
  console.log('script.js');

  // Navigation
  const KEYCODE_ESC = 27;
  var navigation = $('#main-nav').okayNav({
    parent: '.main-nav-wrapper',
    swipe_enabled: false
  });

  $('.navbar').sticky({
    zIndex: 20
  });

  $('.sticky-banners').stick_in_parent({
    parent: '.js-parent-sticky-sidebar-banners',
    offset_top: 56
  });

  if (window.matchMedia('(max-width: 1279px)').matches) {
    $('.sticky-banners').trigger('sticky_kit:detach');
  }

  let searchbar = document.querySelector('.searchbar');

  if (searchbar) {
    let searchbarToggler = searchbar.querySelector('.searchbar-toggler');
    let searchbarInput = searchbar.querySelector('.searchbox__input');

    let onSearchBarEscPress = function(event) {
      if (event.keyCode === KEYCODE_ESC) {
        hideSearchBarContent();
      }
    };

    let onSearchBarClickOut = function(event) {
      var parentNode = event.target;
      var isClickOut = true;

      while (parentNode) {
        if (parentNode.classList.contains('searchbar')) {
          isClickOut = false;
          break;
        }
        parentNode = parentNode.parentElement;
      }

      if (isClickOut) {
        hideSearchBarContent();
      }
    };

    let showSearchBarContent = function() {
      searchbar.classList.remove('searchbar--closed');
      searchbarInput.focus();
      document.addEventListener('keydown', onSearchBarEscPress);
      document.addEventListener('click', onSearchBarClickOut);
    };

    let hideSearchBarContent = function() {
      searchbar.classList.add('searchbar--closed');
      document.removeEventListener('keydown', onSearchBarEscPress);
    };

    searchbarToggler.addEventListener('click', function(event) {
      event.preventDefault();
      showSearchBarContent();
    });
  }
});
