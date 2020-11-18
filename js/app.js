/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
let sections = document.querySelectorAll("section");
let nav = document.querySelector(".navbar__menu");
let header = document.querySelector(".page__header");
let ul = document.querySelector("#navbar__list");

let scrollDelay = 1000; // 1 second delay for scrolling to sections
let previousScrollPos = window.pageYOffset; // scroll position (current position from the top)
nav.setAttribute("style", "color: #242424; margin: 10px;"); // setting basic styles to the nav

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

function getItemText(elms) {
  // Getting the section names using their data attribute
  let itemsText = [];
  elms.forEach((elm) => {
    itemsText.push(elm.dataset.nav);
  });
  return itemsText;
}

function isVisible(elm) {
  // Checking if a single element is visible in Viewport
  let pos = elm.getBoundingClientRect();
  return pos.top >= 0 && pos.bottom <= window.innerHeight;
}

function ease(t, b, c, d) {
  // Used for smoother and less boring scrolling
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

function buildItems(elms) {
  // Populating the nav with a list and list items and adding some styles
  let items = [];

  elms.forEach((elm) => {
    let itemText = elm.dataset.nav;
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.innerText = itemText; // putting the section name
    a.setAttribute("style", "cursor: pointer; text-decoration:none;");
    a.setAttribute("id", `${elm.id}`); // used later for the scrolling to section event

    li.appendChild(a);
    li.setAttribute("style", "padding: 10px;");
    items.push(li);
  });
  return items;
}

// Add class 'active' to section when near top of viewport
function windowScroll() {
  // Looking for the Active Section and adding the active class
  sections.forEach((sec) => {
    if (isVisible(sec)) {
      sec.classList.add("your-active-class");
    } else {
      sec.classList.remove("your-active-class");
    }
  });

  // Hiding the Scrollbar
  let currentScrollPos = window.pageYOffset;
  if (currentScrollPos - previousScrollPos > 0) {
    header.setAttribute("style", "display:none;");
  } else {
    header.setAttribute("style", "display:fixed;");
  }
  previousScrollPos = currentScrollPos;
}

// Scroll to anchor ID using scrollTO event
function linkClick(e, duration) {
    // callback function for link clicking
  e.preventDefault();

  let targetElm = document.querySelector(`section#${e.target.id}`);
  let startPosition = window.pageYOffset;
  let targetPosition = targetElm.getBoundingClientRect().top;    // distance from target to window top
  let startTime = null;

  function scrollAnimation(currentTime) {
    if (startTime === null) startTime = currentTime;

    let timeElapsed = currentTime - startTime;
    let scrollAmount = ease(
      timeElapsed,
      startPosition,
      targetPosition,
      duration
    );
    
    window.scrollTo(0, scrollAmount);

    if (timeElapsed < duration) requestAnimationFrame(scrollAnimation); // used for a smooth scroll animation
  }

  if (Math.abs(targetPosition) > 30) requestAnimationFrame(scrollAnimation); // only scroll after a threshold
}

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
buildItems(sections).forEach((item) => {
  ul.appendChild(item);
});

// Scroll to section on link click
let aLinks = document.querySelectorAll("nav ul li a");
aLinks.forEach((a) => {
  a.addEventListener("click", function (e) {
    linkClick(e, scrollDelay);
  });
});

// Set sections as active
window.addEventListener("scroll", windowScroll);
