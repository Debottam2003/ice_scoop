let login = document.getElementById("login-btn");
let account = document.getElementById("account-btn");
let mobile_login = document.getElementById("mobile-login");
let mobile_account = document.getElementById("mobile-account");

let email = localStorage.getItem("userEmail");
let exp = localStorage.getItem("exp");
if (exp && Number(exp) <= Date.now()) {
  // Remove the session markers
  localStorage.removeItem("userEmail");
  localStorage.removeItem("exp");
  login.style.display = "flex";
  mobile_login.style.display = "flex";
} else if (exp && Number(exp) > Date.now()) {
  account.style.display = "flex";
  mobile_account.style.display = "flex";
} else {
  login.style.display = "flex";
  mobile_login.style.display = "flex";
}

function scrollToFlavors() {
  window.location.href = 'icescoop/flavours';
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('active');
  });

  // Close menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('active');
    });
  });
});
