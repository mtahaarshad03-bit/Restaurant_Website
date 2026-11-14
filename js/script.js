// Olive & Ember — menu filters, mobile navigation, and reservation demo
"use strict";

const menuTabs = document.querySelectorAll(".menu-tab");
const foodCards = document.querySelectorAll(".food-card");
const menuGrid = document.getElementById("menuGrid");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const reservationForm = document.getElementById("reservationForm");
const bookingDate = document.getElementById("bookingDate");
const formMessage = document.getElementById("formMessage");
const toast = document.getElementById("toast");

function filterMenu(category) {
  foodCards.forEach(card => {
    const matches = category === "all" || card.dataset.category === category;
    card.hidden = !matches;
  });
}

menuTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    menuTabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    filterMenu(tab.dataset.category);
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

// Prevent guests from choosing a date in the past.
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().split("T")[0];
bookingDate.min = localToday;

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3800);
}

reservationForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!reservationForm.reportValidity()) return;

  const formData = new FormData(reservationForm);
  const guestName = String(formData.get("name")).trim();
  const date = String(formData.get("date"));

  if (date < localToday) {
    formMessage.textContent = "Please choose today or a future date.";
    bookingDate.focus();
    return;
  }

  formMessage.textContent = `Thank you, ${guestName}! Your reservation request has been prepared. Please call the restaurant to confirm your table.`;
  showToast("Thanks! Your demo reservation request is ready.");
  reservationForm.reset();
  bookingDate.min = localToday;
});

// Keep menu filtering keyboard accessible through native buttons.
filterMenu("all");
