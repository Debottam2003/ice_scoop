
    function scrollToFlavors() {
      document.getElementById('flavors').scrollIntoView({
        behavior: 'smooth'
      });
    }
    
    // Mobile menu functionality
    document.addEventListener('DOMContentLoaded', function() {
      const hamburger = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      
      hamburger.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
      });
      
      // Close menu when clicking on a link
      const mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
          mobileMenu.classList.remove('active');
        });
      });
      
      // Search functionality
      const searchBtn = document.getElementById('search-btn');
      searchBtn.addEventListener('click', function() {
        const searchTerm = document.getElementById('sb').value;
        if(searchTerm.trim() !== '') {
          alert('Searching for: ' + searchTerm);
          // Implement actual search functionality here
        }
      });
      
      // Allow search on Enter key
      document.getElementById('sb').addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
          searchBtn.click();
        }
      });
    });
