const sidebar = document.querySelector(".sidebar");
const sidebarClose = document.querySelector("#sidebar-close");
const menu = document.querySelector(".menu-content");
const menuItems = document.querySelectorAll(".submenu-item");
const subMenuTitles = document.querySelectorAll(".submenu .menu-title");
const mainContent = document.querySelector(".main");
const dropdownItems = document.querySelectorAll(".dropdown-content a");

// Toggle sidebar on button click
sidebarClose.addEventListener("click", () => sidebar.classList.toggle("close"));

// Handle submenu item clicks
menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    menu.classList.add("submenu-active");
    item.classList.add("show-submenu");
    menuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show-submenu");
      }
    });
  });
});

// Handle submenu title clicks to close submenu
subMenuTitles.forEach((title) => {
  title.addEventListener("click", () => {
    menu.classList.remove("submenu-active");
  });
});

// Add more interactive content

// Handle dropdown item clicks
// Assuming you have a reference to the container where you display the content
const contentContainer = document.getElementById('content-container'); // Replace 'content-container' with the actual ID of your container

// Store the previous view information
let previousView = null;


// Function to update main content
function updateMainContent(title, content) {
  mainContent.innerHTML = `<h1>${title}</h1><p>${content}</p>`;
}

document.getElementById("sidebar-close").addEventListener("click", function() {
  document.querySelector(".sidebar").classList.toggle("open");
});

// Remove the sliding effect when clicking on FAQ and About Us
document.querySelectorAll(".submenu-item").forEach(function(item) {
  item.addEventListener("click", function(event) {
    event.stopPropagation();
  });
});



