
    function scrollToFlavors() {
      window.location.href='icescoop/flavours';
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
      
      // Allow search on Enter key
      document.getElementById('sb').addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
          searchBtn.click();
        }
      });
    });
