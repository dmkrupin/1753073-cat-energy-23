let menuToggle = document.querySelector('.page-header__menu-toggle');
let menu = document.querySelector('.page-header__nav');

menuToggle.classList.remove('page-header__menu-toggle--nojs');
menu.classList.remove('page-header__nav--nojs');

menuToggle.addEventListener('click', function() {
  if (menu.classList.contains('page-header__nav--closed')) {
    menu.classList.remove('page-header__nav--closed');
    menu.classList.add('page-header__nav--opened');
  } else {
    menu.classList.add('page-header__nav--closed');
    menu.classList.remove('page-header__nav--opened');
  }
});
