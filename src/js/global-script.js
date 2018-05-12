$( document ).ready(function() {

  // Меню юзера: мегадизайнер мегадизайнерит меню юзера
  $('#b-user-drop').on('show.bs.dropdown', function(){
    $(this).after('<div class="b-user__backdrop" id="b-user-backdrop" />');
  });
  $('#b-user-drop').on('hide.bs.dropdown', function(){
    $('#b-user-backdrop').remove();
  });

  // Мини-карточки объектов: включение/выключение видимости статистики
  $(document).on('click', '[data-b-card-stats-toggle]', function(){
    $(this).toggleClass('b-card-mini__footer-part--active').closest('[data-b-card]').find('[data-b-card-stats]').slideToggle();
  });

  // Сокрытие нижнего инфоблока (прибит к нижнему краю вьюпорта)
  $('[data-b-info-bottom] .close').on('click', function(){
    $(this).closest('[data-b-info-bottom]').fadeOut();
  });

  // Включение кастомных селектов для новых форм (заменяют обычные select-ы)
  $('.b-select select').selectBox({
    mobile: true,
    keepInViewport: false,
  });

  // Работы выбора страны проживания
  $('#country').countrySelect({
    defaultCountry: 'ru',
    preferredCountries: ['ru', 'ua'],
  });

  // Включение селектора телефонного кода
  $('#b-phone').intlTelInput({
    autoHideDialCode: false,
    initialCountry: 'ru',
    preferredCountries: ['ru', 'ua'],
  });

  // Включение селектора языков
  $('#b-langs').tagsInput({
    'height':'auto',
    'width':'100%',
    'interactive': false,
  });
  $('#b-lang-select').selectBox({
    mobile: true,
    keepInViewport: false,
  }).change(function() {
    console.log( $(this).val() );
    $('#b-langs').addTag( $(this).val() );
  });

});

