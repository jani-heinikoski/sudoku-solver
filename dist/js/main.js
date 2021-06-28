const menu = document.querySelector(".menu");
const menuButton = document.querySelector(".hamburger-menu");
const menuNavUnorderedList = document.querySelector(".menu-nav");
const menuNavListItems = document.querySelectorAll(".menu-nav-item");
const showClassName = "show";
const closeClassName = "close";

let menuVisible = false;

menuButton.addEventListener("click", onMenuBtnClick);

function onMenuBtnClick() {
  if (!menuVisible) {
    menu.classList.add(showClassName);
    menuButton.classList.add(closeClassName);
    menuNavUnorderedList.classList.add(showClassName);
    menuNavListItems.forEach((item) => item.classList.add(showClassName));
    menuVisible = true;
  } else {
    menu.classList.remove(showClassName);
    menuButton.classList.remove(closeClassName);
    menuNavUnorderedList.classList.remove(showClassName);
    menuNavListItems.forEach((item) => item.classList.remove(showClassName));
    menuVisible = false;
  }
}
