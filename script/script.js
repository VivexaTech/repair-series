document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('mainNavbar');

    
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});
    
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            
            if (menuToggle.classList.contains('show')) {
                bsCollapse.toggle();
            }
        });
    });
});