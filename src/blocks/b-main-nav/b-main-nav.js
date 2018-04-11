document.addEventListener('DOMContentLoaded', function(){

  document.querySelector('#nav-backdrop').addEventListener('click', function(){
    var click = new Event('click');
    document.querySelector('[data-target-id="nav"]').dispatchEvent(click);
  });

});
