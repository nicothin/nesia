$( document ).ready(function() {

  // Детектор направления скролла
  var lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
      $('body').addClass('scroll-to-down').removeClass('scroll-to-up');
    } else {
      $('body').removeClass('scroll-to-down').addClass('scroll-to-up');
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }, false);

  // Локация: Переключение «вкладок» фото/карта/улицы/
  $('.choose_show a').on('click', function (e) {
    e.preventDefault();
    $('.sw_show').hide();
    $($(this).attr('href')).show();
  })

  // Метод, определяющий видиомость чего-либо во вьюпорте
  $.fn.showInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  };

  // Локация: Показ/сокрытие кнопки добавления в избранное
  $(window).on('resize scroll', function () {
    if ($('#hide-favorite-btn').showInViewport()) {
      $('#temp-id1').addClass('b-save-btn--hidden');
    } else {
      $('#temp-id1').removeClass('b-save-btn--hidden');
    }
  });

  // ВРЕМЕННОЕ ДЕМО! ТОЛКЬО НЕ В ПРОД! Локация: Визуализация работы кнопки Save
  $('#temp-id1').on('click', function () {
    var saveTextNode = $(this).find('.b-save-btn__text-save');
    var inactiveText = $(saveTextNode).data('inactive-text');
    var activeText = $(saveTextNode).data('active-text');
    $(this).toggleClass('b-save-btn--active');
    if ($(this).is('.b-save-btn--active')) {
      $(saveTextNode).text(activeText);
    }
    else {
      $(saveTextNode).text(inactiveText);
    }
  });

});

