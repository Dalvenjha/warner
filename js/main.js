function showMenu() {
  console.log('working menu');
  var el = document.getElementById("main-menu");
  el.classList.toggle("active");
}

function openNav() {
  document.getElementById("mySidenav").style.width = "320px";
  document.getElementById("content-nav-lateral").style.marginLeft = "320px";
}
  
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("content-nav-lateral").style.marginLeft= "0";
}