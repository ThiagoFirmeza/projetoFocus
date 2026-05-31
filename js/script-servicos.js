document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. CONTROLE DO MENU MOBILE (UNIVERSAL) --- */
    const menuToggle = document.querySelector('#mobile-menu');
    const navMenus = document.querySelectorAll('.nav-links, .nav-links-servico1');

    if (menuToggle && navMenus.length) {
        const closeMobileMenu = () => {
            menuToggle.classList.remove('active');
            navMenus.forEach(menu => menu.classList.remove('active'));
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navMenus.forEach(menu => menu.classList.toggle('active'));
        });

        navMenus.forEach(menu => {
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        });

        document.addEventListener('click', (e) => {
            const clickedInsideMenu = Array.from(navMenus).some(menu => menu.contains(e.target));
            const clickedToggle = menuToggle.contains(e.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMobileMenu();
            }
        });
    }

    /* --- 2. ANIMAÇÃO DE SURGIMENTO (SCROLL REVEAL) --- */
    const secoes = document.querySelectorAll('section');

    if ('IntersectionObserver' in window && secoes.length) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        secoes.forEach(secao => {
            secao.style.opacity = '0';
            secao.style.transform = 'translateY(30px)';
            secao.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(secao);
        });
    }

    /* --- 3. CLIQUE NA LOGO (VOLTAR PARA HOME) --- */
    const logoContainer = document.querySelector('.logo-servico1');

    if (logoContainer) {
        logoContainer.style.cursor = 'pointer';
        logoContainer.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    /* --- 4. AJUSTE DE LINKS ATIVOS --- */
    const navItems = document.querySelectorAll('.nav-links a, .nav-links-servico1 a');

    if (secoes.length && navItems.length) {
        const updateActiveLink = () => {
            let current = '';

            secoes.forEach(secao => {
                const sectionTop = secao.offsetTop;

                if (window.pageYOffset >= sectionTop - 150) {
                    current = secao.getAttribute('id') || '';
                }
            });

            navItems.forEach(item => {
                const href = item.getAttribute('href') || '';
                item.classList.toggle('active', Boolean(current) && href.includes(current));
            });
        };

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }

    /* --- 5. LÓGICA DA TIMELINE (RESPONSIVA) --- */
    const scrollContainer = document.getElementById('scrollContainer');
    const nodes = document.querySelectorAll('.node');
    const progressLine = document.getElementById('progressLine');
    const timelineTrack = document.getElementById('timelineTrack');
    let currentIndex = 0;

    if (scrollContainer && nodes.length) {
        const getNodeCenter = (node) => node.offsetLeft + (node.offsetWidth / 2);

        const updateProgressBar = () => {
            if (!progressLine) return;

            const firstNodeCenter = getNodeCenter(nodes[0]);
            const currentNodeCenter = getNodeCenter(nodes[currentIndex]);
            progressLine.style.width = `${currentNodeCenter - firstNodeCenter}px`;
        };

        const setupTrack = () => {
            if (!timelineTrack) return;

            const firstNodeCenter = getNodeCenter(nodes[0]);
            const lastNodeCenter = getNodeCenter(nodes[nodes.length - 1]);

            timelineTrack.style.left = `${firstNodeCenter}px`;
            timelineTrack.style.width = `${lastNodeCenter - firstNodeCenter}px`;
            updateProgressBar();
        };

        window.goToStep = (dir) => {
            currentIndex = Math.max(0, Math.min(nodes.length - 1, currentIndex + dir));
            const node = nodes[currentIndex];
            const targetX = getNodeCenter(node) - (scrollContainer.clientWidth / 2);

            scrollContainer.scrollTo({
                left: targetX,
                behavior: 'smooth'
            });

            nodes.forEach((n, i) => n.classList.toggle('active', i === currentIndex));
            updateProgressBar();
        };

        /* --- SUPORTE A SWIPE / ARRASTAR --- */
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });

        scrollContainer.addEventListener('mouseleave', () => {
            isDown = false;
        });

        scrollContainer.addEventListener('mouseup', () => {
            isDown = false;
        });

        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;

            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });

        setTimeout(() => {
            setupTrack();
            window.goToStep(0);
        }, 200);

        window.addEventListener('resize', () => {
            setupTrack();
            window.goToStep(0);
        });
    }
});