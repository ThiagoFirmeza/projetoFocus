document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. CONTROLE DO MENU MOBILE (UNIVERSAL) --- */
    // Seleciona o botão hamburguer e a lista de links
    const menuToggle = document.querySelector('#mobile-menu');
    // Tenta encontrar a lista de links (funciona para as classes das 3 páginas)
    const navLinks = document.querySelector('.nav-links-servico1');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita conflitos de clique
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fecha o menu automaticamente ao clicar em qualquer link (âncora)
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Fecha o menu se o usuário clicar fora dele (melhora a experiência no celular)
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    /* --- 2. ANIMAÇÃO DE SURGIMENTO (SCROLL REVEAL) --- */
    // Faz as seções aparecerem suavemente ao dar scroll
    const secoes = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1, // Dispara quando 10% da seção aparece
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    secoes.forEach(secao => {
        // Estado inicial (escondido)
        secao.style.opacity = "0";
        secao.style.transform = "translateY(30px)";
        secao.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        observer.observe(secao);
    });

    /* --- 3. CLIQUE NA LOGO (VOLTAR PARA HOME) --- */
    const logoContainer = document.querySelector('.logo-servico1');
    if (logoContainer) {
        logoContainer.style.cursor = 'pointer';
        logoContainer.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    /* --- 4. AJUSTE DE LINKS ATIVOS (OPCIONAL) --- */
    // Destaca o link no menu conforme a seção visível
    const navItems = document.querySelectorAll('.nav-links-servico1 a');
    window.addEventListener('scroll', () => {
        let current = "";
        secoes.forEach(secao => {
            const sectionTop = secao.offsetTop;
            const sectionHeight = secao.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = secao.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

});