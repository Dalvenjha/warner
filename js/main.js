window.onload = function() {
    let handlers = document.getElementsByClassName('c-sidebar-navigator__link');
    this.console.log(handlers.length);
    for( let i = 0; i < handlers.length; i++) {
        console.log(handlers[i].text);
        handlers[i].onclick = function(event) {
            event.preventDefault();
            let elem = event.target;
            let destiny = elem.getAttribute('href');
            let content = document.getElementById(destiny);
            let offTop = content.offsetTop;
            console.log(offTop);
            window.scrollTo({top: offTop, behavior: 'smooth'});
            closeNav();
        }
    } 
}

function showMenu() {
  console.log('working menu');
  var el = document.getElementById("main-menu");
  el.classList.toggle("active");
}

function openNav() {
  document.getElementById("mySidenav").style.width = "320px";
//   document.getElementById("content-nav-lateral").style.marginLeft = "320px";
}
  
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
//   document.getElementById("content-nav-lateral").style.marginLeft= "0";
}

function scrolling() {
    console.log('hi i\'m scrollign');
}