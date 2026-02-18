document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('mainNavbar');

    // Add 'scrolled' class to navbar when user scrolls down
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close the mobile menu automatically when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});
    
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            // Check if menu is expanded (mobile view)
            if (menuToggle.classList.contains('show')) {
                bsCollapse.toggle();
            }
        });
    });
});