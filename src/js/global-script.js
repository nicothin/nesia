$( document ).ready(function() {

  // Меню юзера: мегадизайнер мегадизайнерит
  $('#b-user-drop').on('show.bs.dropdown', function(){
    $(this).after('<div class="b-user__backdrop" id="b-user-backdrop" />');
  });
  $('#b-user-drop').on('hide.bs.dropdown', function(){
    $('#b-user-backdrop').remove();
  });

});

