document.querySelector("body").style.display = "block";
function updateAuthUI() {
  const login = document.getElementById("login-btn");
  const account = document.getElementById("account-btn");
  const mobile_login = document.getElementById("mobile-login");
  const mobile_account = document.getElementById("mobile-account");

  const email = localStorage.getItem("userEmail");
  const exp = localStorage.getItem("exp");

  const isMobile = window.innerWidth < 600;

  // First, hide all buttons
  login.style.display = "none";
  account.style.display = "none";
  mobile_login.style.display = "none";
  mobile_account.style.display = "none";

  if (exp && Number(exp) <= Date.now()) {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("exp");
    localStorage.removeItem("cart");

    if (isMobile) {
      mobile_login.style.display = "block";
    } else {
      login.style.display = "inline-block";
    }
  } else if (exp && Number(exp) > Date.now()) {
    if (isMobile) {
      mobile_account.style.display = "block";
    } else {
      account.style.display = "inline-block";
    }
  } else {
    if (isMobile) {
      mobile_login.style.display = "block";
    } else {
      login.style.display = "inline-block";
    }
  }
}

// Call the function on load
updateAuthUI();

// Re-evaluate when screen is resized
window.addEventListener("resize", updateAuthUI);

function navigateToFlavors() {
  window.location.href = "/icescoop/flavours";
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

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }
});
// normal page load pageshow ✅  but event.persisted ❌
//page back/forwar pageshow ✅  and event.persisted ✅