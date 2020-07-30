$( document ).ready(function() {

  // Детектор направления скролла и связанные эффекты
  var lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    // Посетитель скроллит вниз
    if (st > lastScrollTop) {
      // $('body').addClass('scroll-to-down').removeClass('scroll-to-up');
      // Если скролл уже больше высоты шапки на мобилке, добавим класс сокрытия поиска шапки
      if(st > 96) {
        $('body').addClass('hide-header-search-xs');
      }
      // Скролл меньше высоты шапки - уберем класс сокрытия поиска
      else {
        $('body').removeClass('hide-header-search-xs');
      }
    }
    // Посетитель скроллит вверх
    else {
      // $('body').removeClass('scroll-to-down').addClass('scroll-to-up');
      // Убираем класс сокрытия поиска в шапке
      $('body').removeClass('hide-header-search-xs');
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
  if ($('#hide-favorite-btn').length) {
    $(window).on('resize scroll', function () {
      if ($('#hide-favorite-btn').showInViewport()) {
        $('#temp-id1').addClass('b-save-btn--hidden');
      } else {
        $('#temp-id1').removeClass('b-save-btn--hidden');
      }
    });
  }



  // Показ и сокрытие блочков слайд-эффектом
  $('[data-slide-toggler]').on('click', function(e) {
    e.preventDefault();
    var that = $(this);
    that.toggleClass('js-open');
    var thatOpenText = that.data('slide-shown');
    var thatHiddenText = that.data('slide-hidden');
    $(that.data('slide-toggler')).slideToggle(200, function() {
      if( thatHiddenText && thatOpenText) {
        if ($(this).is(':visible')) {
          that.find('.js-text').text(thatOpenText);
        } else {
          that.find('.js-text').text(thatHiddenText);
        }
      }
    });
  });



  // Включение popover
  $('[data-toggle="popover"]').popover();
  // Закрытие popover при клике вне его
  $(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false  // fix for BS 3.3.6
      }
    });
  });



  // Допишем на html размеры скролла
  const outer = document.createElement('div');
  const inner = document.createElement('div');
  outer.style.overflow = 'scroll';
  outer.classList.add('b-scroll');
  document.body.appendChild(outer);
  outer.appendChild(inner);
  const scrollbarSize = outer.offsetWidth - inner.offsetWidth;
  document.body.removeChild(outer);
  document.documentElement.style.setProperty('--css-custom-scroll-size', `${scrollbarSize}px`);

  // Цена и кнопки плюс/минус (поле формы с выбором цены)
  var fieldsNum = document.querySelectorAll('.b-field-num');
  if (fieldsNum.length) {
    Array.prototype.forEach.call(fieldsNum, function (field) {
      const input = field.querySelector('.b-field-num__input');
      const text = field.querySelector('.b-field-num__text-num');
      const valueMin = input.getAttribute('min') ? +input.getAttribute('min') : -Infinity;
      const valueMax = input.getAttribute('max') ? +input.getAttribute('max') : Infinity;
      const valueStep = input.getAttribute('step') ? +input.getAttribute('step') : 1;
      field.addEventListener('click', function (event) {
        if (event.target.classList.contains('b-field-num__btn') && !input.getAttribute('disabled')) {
          var num = parseInt(input.value);
          if (isNaN(num)) num = 0;
          if (event.target.classList.contains('b-field-num__btn--plus')) {
            if (num < valueMax) input.value = num + valueStep;
          }
          if (event.target.classList.contains('b-field-num__btn--minus')) {
            if (num > valueMin) input.value = num - valueStep;
          }
          if (text) {
            text.innerText = new Intl.NumberFormat('en-US').format(input.value);
          }
        }
      });
    });
  }



  // Модалки, который на мобильном вьюпорте модалки, а на большом — сообщения в нижнем правом углу (имитация бутстраповских)
  $('[data-toggle="modal2"]').on('click', function(e){
    e.preventDefault();
    $('.b-modal-2--messages').hide().removeClass('in');
    var target = $(this).attr('href') || $(this).data('target');
    $(target).toggle();
    setTimeout(function(){
      $(target).toggleClass('in');
    }, 100)
  });
  $('[data-dismiss="modal2"], .b-modal-2--messages').on('click', function(e){
    e.preventDefault();
    var target = $(this).closest('.modal');
    $(target).toggleClass('in');
    setTimeout(function(){
      $(target).toggle();
    }, 300)
  });
  $('.b-modal-2--messages .modal-dialog').on('click', function (e) {
    e.stopPropagation();
  });



  // Аукцион: сортировка пунктов-предложений
  $('[data-sorter]').on('click', function(e){
    e.preventDefault();
    var triggerParent = $(this).closest('[data-sorter-active-class]');
    var activeClass = $(triggerParent).data('sorter-active-class');
    var sorterAttr = $(this).data('sorter');
    var targetList = $(this).data('sorter-list-id');
    var list = $.makeArray($('#' + targetList + ' li'));
    list.sort(function(a, b){
      return a.dataset[sorterAttr] - b.dataset[sorterAttr];
    });
    $('#' + targetList).html(list);
    $(triggerParent).find('.' + activeClass).removeClass(activeClass);
    $(this).addClass(activeClass);
  });



  // Сообщения: переключение видимости чатов
  $('a[data-chat-id]').on('click', function(e){
    e.preventDefault();
    $('.b-chat-item').removeClass('b-chat-item--active');
    $(this).addClass('b-chat-item--active');
    $('.b-messages__chats-item').removeClass('b-messages__chats-item--active');
    $('.b-messages__chats-item#' + $(this).data('chat-id')).addClass('b-messages__chats-item--active');
  });
  // Сокрытие чата кликом по кнопке «назад»
  $('.b-chat__back-btn').on('click', function (e) {
    e.preventDefault();
    $('.b-messages__chats-item').removeClass('b-messages__chats-item--active');
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

