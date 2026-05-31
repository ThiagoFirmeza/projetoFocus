/* =========================================================
   FOCUS — EFFECTS FRAMEWORK JS
   Ativa todos os efeitos do effects.css + lógica própria
   ========================================================= */

(function () {
    'use strict';

    /* ── UTILS ──────────────────────────────────────────────── */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const isMobile = () => window.innerWidth <= 768 || !matchMedia('(hover: hover)').matches;

    /* ── 1. CURSOR PERSONALIZADO ─────────────────────────────── */
    function initCursor() {
        if (isMobile()) return;

        const dot  = document.createElement('div');
        const ring = document.createElement('div');
        dot.className  = 'cursor-dot';
        ring.className = 'cursor-ring';
        document.body.append(dot, ring);

        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        let rafId;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left  = mouseX + 'px';
            dot.style.top   = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            rafId = requestAnimationFrame(animateRing);
        }
        animateRing();

        const hoverTargets = 'a, button, .cardServico, .cardFeedback, .cardValores, .nav-btn, .whatsapp-float';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.remove('cursor-hover');
            }
        });

        // Esconder ao sair da janela
        document.addEventListener('mouseleave', () => {
            dot.style.opacity = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            dot.style.opacity = '1';
            ring.style.opacity = '1';
        });
    }

    /* ── 2. SCROLL REVEAL ───────────────────────────────────── */
    function initScrollReveal() {
        // Seleciona elementos marcados com data-reveal ou data-reveal-group
        const targets = $$('[data-reveal], [data-reveal-group]');

        if (!targets.length || !('IntersectionObserver' in window)) {
            // Fallback: mostrar tudo
            targets.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        targets.forEach(el => obs.observe(el));

        // Animar linhas nos títulos
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('title-animated');
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const titles = $$(
            '.h1QuemSomos, .timeline-title, .h2servicos, .tituloValores, ' +
            '.tituloUnidades, .tituloFeedback, .titulo-com-linha, .titulo-centralizado'
        );
        titles.forEach(el => titleObserver.observe(el));

        // Highlight de palavras-chave
        const highlights = $$('.highlight-text');
        const hlObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    hlObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        highlights.forEach(el => hlObs.observe(el));
    }

    /* ── 3. TILT 3D NOS CARDS ───────────────────────────────── */
    function initTilt() {
        if (isMobile()) return;

        const cards = $$('.cardServico, .cardFeedback, .card-servico1, .card-estilizado, .cardValores');

        cards.forEach(card => {
            card.classList.add('tilt-card');

            // Cria o elemento de glare
            const glare = document.createElement('div');
            glare.className = 'tilt-glare';
            card.appendChild(glare);

            card.addEventListener('mousemove', (e) => {
                const rect  = card.getBoundingClientRect();
                const x     = e.clientX - rect.left;
                const y     = e.clientY - rect.top;
                const cx    = rect.width  / 2;
                const cy    = rect.height / 2;
                const rotY  =  ((x - cx) / cx) * 8;
                const rotX  = -((y - cy) / cy) * 6;

                card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
                glare.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                glare.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ── 4. PROGRESS BAR DE SCROLL ──────────────────────────── */
    function initScrollProgress() {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress-bar';
        document.body.appendChild(bar);

        window.addEventListener('scroll', () => {
            const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct        = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
            bar.style.width  = pct + '%';
        }, { passive: true });
    }

    /* ── 5. EFEITO RIPPLE NOS BOTÕES ────────────────────────── */
    function initRipple() {
        const btns = $$(
            '.btn-contato, .btn-contato-mobile, .btn-contato-servico1, ' +
            '.cardServico button, .nav-btn, .buttonServico1, .buttonServico2, .buttonServico3'
        );

        btns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                const size = Math.max(this.clientWidth, this.clientHeight);
                const rect = this.getBoundingClientRect();
                ripple.style.width  = size + 'px';
                ripple.style.height = size + 'px';
                ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
                this.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove());
            });
        });
    }

    /* ── 6. NAVBAR GLASSMORPHISM AO ROLAR ───────────────────── */
    function initNavbarScroll() {
        const navbars = $$('.navbar, .navbar-servico1');
        if (!navbars.length) return;

        const handler = () => {
            const scrolled = window.scrollY > 40;
            navbars.forEach(nav => nav.classList.toggle('scrolled', scrolled));
        };

        window.addEventListener('scroll', handler, { passive: true });
        handler();
    }

    /* ── 7. BOTÃO WHATSAPP FLUTUANTE ────────────────────────── */
    function initWhatsappFloat() {
        if ($('.whatsapp-float')) return; // Já existe
        const btn = document.createElement('a');
        btn.className = 'whatsapp-float';
        btn.href      = 'https://wa.me/5584999999999'; // Substitua pelo número real
        btn.target    = '_blank';
        btn.rel       = 'noopener noreferrer';
        btn.setAttribute('aria-label', 'Fale conosco pelo WhatsApp');
        btn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        document.body.appendChild(btn);
    }

    /* ── 8. PARTICLES (CANVAS) NA SEÇÃO QUEM SOMOS ──────────── */
    function initParticles() {
        const section = $('.quemSomos') || $('.hero-servico1');
        if (!section || isMobile()) return;

        section.style.position = 'relative';
        section.style.overflow = 'hidden';

        const canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        section.insertBefore(canvas, section.firstChild);

        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        function resize() {
            W = canvas.width  = section.offsetWidth;
            H = canvas.height = section.offsetHeight;
        }

        function createParticle() {
            return {
                x:    Math.random() * W,
                y:    Math.random() * H,
                r:    Math.random() * 2.5 + 0.8,
                vx:   (Math.random() - 0.5) * 0.35,
                vy:   (Math.random() - 0.5) * 0.35,
                a:    Math.random() * 0.5 + 0.2,
            };
        }

        function init() {
            resize();
            particles = Array.from({ length: 55 }, createParticle);
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);

            particles.forEach((p, i) => {
                // Update
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(52, 152, 219, ${p.a})`;
                ctx.fill();

                // Draw lines between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dist = Math.hypot(p.x - q.x, p.y - q.y);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(52, 152, 219, ${(1 - dist / 110) * 0.12})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(draw);
        }

        init();
        draw();

        window.addEventListener('resize', () => {
            resize();
        }, { passive: true });
    }

    /* ── 9. CONTADOR ANIMADO (NÚMEROS) ──────────────────────── */
    function initCounters() {
        const counters = $$('[data-count]');
        if (!counters.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el  = entry.target;
                const end = parseInt(el.dataset.count, 10);
                const dur = 1600;
                const step = 16;
                const increment = end / (dur / step);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= end) {
                        el.textContent = end.toLocaleString('pt-BR');
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current).toLocaleString('pt-BR');
                    }
                }, step);

                obs.unobserve(el);
            });
        }, { threshold: 0.6 });

        counters.forEach(el => obs.observe(el));
    }

    /* ── 10. LAZY LOAD DE IMAGENS ───────────────────────────── */
    function initLazyLoad() {
        if (!('IntersectionObserver' in window)) return;

        const imgs = $$('img[loading="lazy"]');

        imgs.forEach(img => {
            img.classList.add('img-loading');
            img.addEventListener('load',  () => img.classList.remove('img-loading'));
            img.addEventListener('error', () => img.classList.remove('img-loading'));
        });
    }

    /* ── 11. DATA-REVEAL AUTO nos elementos principais ──────── */
    function autoMarkReveal() {
        // Marca automaticamente seções e grupos de cards sem alterar o HTML original
        $$('.cardServico, .cardFeedback, .card-servico1, .card-estilizado').forEach((el, i) => {
            if (!el.closest('[data-reveal-group]') && !el.hasAttribute('data-reveal')) {
                el.setAttribute('data-reveal', '');
            }
        });

        $$('.texto-quem-somos, .texto-aba, .h1QuemSomos, .pQuemSomos').forEach(el => {
            if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'left');
        });

        $$('.foto-placeholder, .foto-placeholder-servico1, .unidade1, .unidade2').forEach(el => {
            if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'right');
        });

        // Grupos
        $$('.services-container, .cards-grid-servico1, .grid-tres-cards, .unidades').forEach(el => {
            if (!el.hasAttribute('data-reveal-group')) el.setAttribute('data-reveal-group', '');
        });
    }

    /* ── INIT ───────────────────────────────────────────────── */
    function init() {
        autoMarkReveal();
        initScrollReveal();
        initTilt();
        initScrollProgress();
        initRipple();
        initNavbarScroll();
        initWhatsappFloat();
        initCounters();
        initLazyLoad();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
