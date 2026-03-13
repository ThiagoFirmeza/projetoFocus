document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('.nav-links-servico1');

    // Controle do Menu Mobile
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Fecha o menu ao clicar em um link
        document.querySelectorAll('.nav-links-servico1 a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // Efeito de Revelação (Scroll Reveal)
    const secoes = document.querySelectorAll('section');
    const observerOptions = { 
        threshold: 0.15, // Dispara um pouco antes
        rootMargin: "0px 0px -50px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                // Para de observar após animar pela primeira vez (opcional)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    secoes.forEach(secao => {
        secao.style.opacity = "0";
        secao.style.transform = "translateY(30px)";
        secao.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        observer.observe(secao);
    });

    const logo = document.querySelector('.logo-servico1');

    logo.style.cursor = 'pointer';

    logo.addEventListener('click', () => {
        window.location.href = 'index.html'; // Altere para o nome do seu arquivo principal
});
});