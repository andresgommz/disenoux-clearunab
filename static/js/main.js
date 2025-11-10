document.addEventListener('DOMContentLoaded', function(){
  var menuBtn = document.getElementById('menuBtn');
  var drawer = document.getElementById('drawer');
  var drawerClose = document.getElementById('drawerClose');
  var dots = Array.from(document.querySelectorAll('.dot'));
  var currentDot = 0;
  function openDrawer(){ drawer.setAttribute('aria-hidden','false') }
  function closeDrawer(){ drawer.setAttribute('aria-hidden','true') }
  menuBtn.addEventListener('click', function(){ openDrawer() });
  drawerClose.addEventListener('click', function(){ closeDrawer() });
  drawer.addEventListener('click', function(e){ if(e.target===drawer) closeDrawer() });
  var dotTimer = setInterval(function(){
    dots[currentDot].classList.remove('active');
    currentDot = (currentDot+1)%dots.length;
    dots[currentDot].classList.add('active');
  }, 3000);
});