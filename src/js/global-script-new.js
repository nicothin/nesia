$( document ).ready(function() {

  // Детектор направления скролла и связанные эффекты
  var lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    // Посетитель скроллит вниз
    if (st > lastScrollTop) {
      $('.b-save-btn').addClass('b-save-btn--animate');
      setTimeout(function(){
        $('.b-save-btn').removeClass('b-save-btn--animate');
      }, 2000);
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
  // Клик по кнопкам +/- выбоар цены: убираем с кнопки offer класс вторичности
  var itemAuction = document.querySelector('.b-info__item--auction');
  if (itemAuction) {
    itemAuction.addEventListener('click', function(e){
      if(e.target.classList.contains('b-field-num__btn')) {
        itemAuction.querySelector('.b-info__btn-offer-wrap .b-btn-2').classList.remove('b-btn-2--secondary');
      }
    });
  }



  // Модалки, которые на мобильном вьюпорте модалки, а на большом — сообщения в нижнем правом углу (имитация бутстраповских)
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
    var targetTab = $('.b-messages__chats-item#' + $(this).data('chat-id'));
    $('body').addClass('b-chat-visible');
    $('.b-chat-item').removeClass('b-chat-item--active');
    $(this).addClass('b-chat-item--active');
    $('.b-messages__chats-item').removeClass('b-messages__chats-item--mobile-active b-messages__chats-item--desktop-active');
    targetTab.addClass('b-messages__chats-item--mobile-active b-messages__chats-item--desktop-active');
    var content = targetTab.find('.b-chat__content')[0];
    var inner = targetTab.find('.b-chat__inner')[0];
    // крутанем скролл вниз
    content.scrollTop = content.scrollHeight;
    // если у внетренней обертки высота меньше внешней, добавим отступ, чтоб сообщения были ниже
    if (inner.offsetHeight < content.offsetHeight) {
      $(inner).css({marginTop: content.offsetHeight - inner.offsetHeight + 'px'});
    }
  });
  // Сокрытие чата кликом по кнопке «назад» для мобилок
  $('.b-chat__back-btn').on('click', function (e) {
    e.preventDefault();
    $('body').removeClass('b-chat-visible');
    $('.b-messages__chats-item').removeClass('b-messages__chats-item--mobile-active');
  });



  // Сообщения: закрытие сообщения, выводимого вверху страницы
  $('[data-dismiss="b-alert"]').on('click', function(e){
    e.preventDefault();
    $(this).closest('.b-alert').fadeOut();
  });



  // Настройки: переключение между картой оплаты и новой картой в модальном окне
  $('#cardSelector').selectBox().change(function () {
    if ($(this).val() == 'addNewCard') {
      $('#cardSelectorFooterDefault').hide();
      $('#cardSelectorFooterNewCard').show();
      $('#cardSelectorNewCard').slideDown();
    }
    else {
      $('#cardSelectorFooterDefault').show();
      $('#cardSelectorFooterNewCard').hide();
      $('#cardSelectorNewCard').slideUp();
    }
  });



  // Редактирование профиля: работа псевдоинпута с телефоном
  const phoneNumberInputWrap = document.querySelector('#countryPhoneCodeWrap');
  if(phoneNumberInputWrap) {
    const phoneNumberInput = document.querySelector('#phoneNumber');
    phoneNumberInput.addEventListener('focus', (e) => {phoneNumberInputWrap.classList.add('b-form-group__phone-wrap--focus');});
    phoneNumberInput.addEventListener('blur', (e) => { phoneNumberInputWrap.classList.remove('b-form-group__phone-wrap--focus');});
    document.querySelector('#countryCodeSelect').addEventListener('change', (event) => {
      document.querySelector('#countryPhoneCode').innerHTML = event.target.value;
    });
  }



  // Сообщения, модальное окно покупки контакта: клик по кнопке покупки меняет содержимое окна
  var payButtonsParent = document.getElementById('unlock-1');
  if (payButtonsParent) {
    payButtonsParent.addEventListener('click', function(e){
      if (e.target.dataset.payFormSum) {
        document.getElementById('tariffs-pay').style.display = 'none';
        document.getElementById('tariffs-pay-form').style.display = 'block';
        var sum = e.target.dataset.payFormSum;
        document.getElementById('tariffs-pay-form-sum-input').value = sum;
        document.querySelectorAll('[data-tariff-sum]').forEach(function(item){
          item.innerHTML = sum;
        });
      }
    });
  }



  // ВРЕМЕННОЕ ДЕМО! ТОЛЬКО НЕ В ПРОД! Локация: Визуализация работы кнопки Save
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



  // summer 2022

  // Добавление css custom properties для хранения кол-ва пикселей подавла, видимых при нынешнем положении скролла
  var getShowingHeight = (elem) => {
    var bounding = elem.getBoundingClientRect();
    return (window.innerHeight || document.documentElement.clientHeight) - bounding.top
  };
  var footer = document.querySelector('.b-footer');
  window.addEventListener('scroll', function (e) {
    var shownPixels = getShowingHeight(footer);
    if (shownPixels < 0) shownPixels = 0;
    document.documentElement.style.setProperty("--footer-pixels-shown", shownPixels + 'px');
  });



  // Карусель для карточек 3го типа
  $('.b-carousel__prev').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest('.carousel').carousel('prev');
  })
  $('.b-carousel__next').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest('.carousel').carousel('next');
  })


  // Переключение карта/список для мобильного представления стр. поиска
  $('.b-search__mobile-viewmode-btns a').on('click', function(e) {
    e.preventDefault();
    $(this).siblings().removeClass('hidden');
    $(this).addClass('hidden');
    const href = $(this).attr('href');
    if (href === '#map-wrapper') {
      document.documentElement.classList.add('is-shown-map');
      const header = document.querySelector('.b-search__header');
      $('.b-search__map-wrapper').css({ top: header.getBoundingClientRect().top + header.getBoundingClientRect().height });
    }
    else {
      document.documentElement.classList.remove('is-shown-map');
    }
  });

  // Карусели
  var standartSliders = [
    '#explore-homes',
    '#new-property-for-buy',
    '#new-property-for-rent',
    '#neighbouring',
  ];
  standartSliders.forEach((slider) => {
    const element = document.querySelector(slider);
    const slideWidth = +element?.dataset?.slideWidth || 225;
    const noCheckLength = element?.dataset?.noCheckLength;
    const edgePadding = +element?.dataset?.edgePadding || 0;
    const btnsTop = +element?.dataset?.btnsTop;
    if (!!element) {
      const sliderCounter = Array.from(element.childNodes)?.filter((child) => child.nodeType === 1).length;
      tns({
        container: slider,
        fixedWidth: slideWidth,
        edgePadding: edgePadding,
        mouseDrag: true,
        nav: false,
        loop: false,
      });
      const parent = element.closest('.b-tns-slider');
      if (noCheckLength === undefined && sliderCounter <= 6) {
        parent.classList.add('b-tns-slider--only-6');
      }
      if (btnsTop) {
        parent.querySelector('[data-controls="prev"]').style.top = `${btnsTop}px`;
        parent.querySelector('[data-controls="next"]').style.top = `${btnsTop}px`;
      }
    }
  });

  // Лендинг: обработка кликов по More в списке Check out a neighborhood
  $(document).on('click', '[data-check-show-more]', function(e) {
    e.preventDefault();
    const parentList = $(this).closest('ul');
    $(parentList).find('.hidden').removeClass('hidden');
    $(this).closest('li').addClass('hidden');
  });

  // Лендинг: обработка кликов по More в ABOUT
  $(document).on('click', '[data-city-about-show-more]', function(e) {
    e.preventDefault();
    const parent = $(this).closest('.b-city-about');
    $(parent).find('.hidden').removeClass('hidden');
    $(this).addClass('hidden');
  });

  $('[data-b-user-menu-has-drop-item]').find('.b-user-menu__submenu').hide();
  $(document).on('click', '[data-b-user-menu-has-drop-item] > a', function (e) {
    e.preventDefault();
    $(this).toggleClass('b-user-menu__link--show-drop');
    $(this).closest('[data-b-user-menu-has-drop-item]').find('ul.b-user-menu__submenu').slideToggle();
  });

});

