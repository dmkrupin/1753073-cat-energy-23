let menuToggle = document.querySelector('.nav__toggle');
let menu = document.querySelector('.nav__list');
let pageHeader = document.querySelector('.page-header');

menuToggle.classList.remove('nav__toggle--nojs');
menu.classList.remove('nav__list--nojs');
pageHeader.classList.remove('page-header--nojs');

menuToggle.addEventListener('click', function() {
  if (menu.classList.contains('nav__list--closed')) {
    menu.classList.remove('nav__list--closed');
    menu.classList.add('nav__list--opened');
  } else {
    menu.classList.add('nav__list--closed');
    menu.classList.remove('nav__list--opened');
  }
});
