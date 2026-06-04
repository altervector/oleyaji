/* ============================================================
   MAIN.JS - Contingut principal de la pàgina
   Depèn de: config.js
   Edita aquí el contingut de cada projecte
   ============================================================ */

(function() {

    const inicialitzar = async() => {

        /* ─── 1. NAVBAR ─────────────────────────────────────────── */
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerHTML = `
                <nav class="navbar">
                    <div class="navbar-logo">
                        <img src="${CONFIG.ASSETS}${CONFIG.LOGO}" alt="${CONFIG.NOM}">
                    </div> 
                       <button class="navbar-hamburguesa">☰</button>
                    
                    <ul class="navbar-menu">
                        <li><a href="#menus">Menús</a></li>

                        <li><a href="#reserves">Reservas</a></li>
                    </ul>
                </nav>
            `;
        }
const btnHamburguesa = document.querySelector('.navbar-hamburguesa');
const menu = document.querySelector('.navbar-menu');

btnHamburguesa.addEventListener('click', () => {
    menu.classList.toggle('obert');
});

menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        menu.classList.remove('obert');
    });
});

// ─── LONG PRESS AL LOGO (1,5 segons → login) ─────────
const logo = document.querySelector('.navbar-logo img');
let timerLogo;

const iniciarPress = (e) => {
    e.preventDefault();
    timerLogo = setTimeout(() => {
        window.obrirModalLogin();
    }, 1500);
};

const aturarPress = () => clearTimeout(timerLogo);

logo.addEventListener('mousedown',   iniciarPress);
logo.addEventListener('mouseup',     aturarPress);
logo.addEventListener('mouseleave',  aturarPress);
logo.addEventListener('touchstart',  iniciarPress, { passive: false });
logo.addEventListener('touchend',    aturarPress);
logo.addEventListener('contextmenu', (e) => e.preventDefault());

       /* ─── 2. HERO ───────────────────────────────────────────── */
        const hero = document.getElementById('hero');
        if (hero) {
            hero.innerHTML = `
                <section class="hero">
                    <img class="hero-imatge" src="${CONFIG.ASSETS}${CONFIG.BLOC_HERO}"
                        alt="${CONFIG.NOM}">
                    <div class="hero-overlay"></div>
                    <div class="hero-contingut">
                        <h1 class="hero-titol">${CONFIG.NOM}</h1>
                        <p class="hero-slogan">${CONFIG.SLOGAN}</p>
                        <a href="#qui-som" class="hero-boto">${CONFIG.HERO_BOTO}</a>
                    </div>
                </section>
            `;
        }

        /* ─── 3. SECCIONS ───────────────────────────────────────── */
        const seccions = document.getElementById('seccions');
        if (seccions) {
            seccions.innerHTML = `

                <section class="seccio" id="menus">
                    <h2 class="seccio-titol">${CONFIG.SECCIO_TITOL}</h2>
                    <div class="menus-grid">

                        <div class="menu-bloc">
                            <a href="javascript:void(0)" onclick="obrirModalPlats()">
                                <div class="menu-bloc-imatge">
                                    <img src="${CONFIG.ASSETS}${CONFIG.BLOC1}"
                                        alt="Plats"
                                        onerror="this.src='${CONFIG.ASSETS}${CONFIG.BLOC_HERO}'">
                                </div>
                                <div class="menu-bloc-text">
                                    <h3>${CONFIG.BLOC1_TITOL}</h3>
                                    <p>${CONFIG.BLOC1_DESC}</p>
                                </div>
                            </a>
                        </div>

                        <div class="menu-bloc">
                            <a href="javascript:void(0)" onclick="obrirModalTapas()">
                                <div class="menu-bloc-imatge">
                                    <img src="${CONFIG.ASSETS}${CONFIG.BLOC2}"
                                        alt="Tapes"
                                        onerror="this.src='${CONFIG.ASSETS}${CONFIG.BLOC_HERO}'">
                                </div>
                                <div class="menu-bloc-text">
                                    <h3>${CONFIG.BLOC2_TITOL}</h3>
                                    <p>${CONFIG.BLOC2_DESC}</p>
                                </div>
                            </a>
                        </div>

                        <div class="menu-bloc">
                            <a href="javascript:void(0)" onclick="obrirModalPostres()">
                                <div class="menu-bloc-imatge">
                                    <img src="${CONFIG.ASSETS}${CONFIG.BLOC3}"
                                        alt="Postres"
                                        onerror="this.src='${CONFIG.ASSETS}${CONFIG.BLOC_HERO}'">
                                </div>
                                <div class="menu-bloc-text">
                                    <h3>${CONFIG.BLOC3_TITOL}</h3>
                                    <p>${CONFIG.BLOC3_DESC}</p>
                                </div>
                            </a>
                        </div>

                        <div class="menu-bloc">
                            <a href="javascript:void(0)" onclick="obrirModalBegudes()">
                                <div class="menu-bloc-imatge">
                                    <img src="${CONFIG.ASSETS}${CONFIG.BLOC4}"
                                        alt="Begudes"
                                        onerror="this.src='${CONFIG.ASSETS}${CONFIG.BLOC_HERO}'">
                                </div>
                                <div class="menu-bloc-text">
                                    <h3>${CONFIG.BLOC4_TITOL}</h3>
                                    <p>${CONFIG.BLOC4_DESC}</p>
                                </div>
                            </a>
                        </div>

                    </div>
                </section>

                <hr class="separador">

                <section class="seccio" id="qui-som">
                    <h2 class="seccio-titol">${CONFIG.QUI_SOM}</h2>
                    <p class="seccio-text">
                        ${CONFIG.QUI_DESC}</p>
                </section>

                <hr class="separador">

                <section class="seccio" id="horaris">
                    <h2 class="seccio-titol">Horarios</h2>
                    <p class="seccio-text">${CONFIG.HORA_1}</p>
                    <p class="seccio-text">${CONFIG.HORA_2}</p>
                    <p class="seccio-text">${CONFIG.HORA_3}</p>
                </section>

                <hr class="separador">

                <section class="seccio" id="reserves">
                    <h2 class="seccio-titol">Haz tu Reserva</h2>
                    <p class="seccio-text">
                        <a href="tel:${CONFIG.TELEFON}">📞 ${CONFIG.TELEFON}</a>
                    </p>
                    <p class="seccio-text">
                        
                    </p>
                </section>
            `;
        }

        /* ─── 4. FOOTER ─────────────────────────────────────────── */

                const footer = document.getElementById('footer');
        if (footer) {
            footer.innerHTML = `
                <footer class="footer">
                    <p class="footer-nom">${CONFIG.NOM}</p>
                    <p>
                        <a href="https://www.google.com/maps/search/?api=1&query=Ole+y+Aji+Vilafranca" target="_blank">
                            ${CONFIG.ADRECA}
                        </a>
                    </p>
                    <p><a href="tel:${CONFIG.TELEFON}">${CONFIG.TELEFON}</a></p>
                    <a href="tel:${CONFIG.MOBIL}">${CONFIG.MOBIL}</a></p>
                    <a href="mailto:${CONFIG.EMAIL}"><img src="${CONFIG.ASSETS}icon/Icomail.png" alt="Instagram" class="icona-app"> ${CONFIG.EMAIL}</a>
                    <p>
                        <a href="${CONFIG.INSTAGRAM}" target="_blank">
                            <img src="${CONFIG.ASSETS}icon/Icoinsta.png" alt="Instagram" class="icona-app"> Instagram
                        </a>
                        <p>
                            <a href="https://search.google.com/local/writereview?placeid=ChIJ0x2mkSp5pBIRAbvYW6nhpFo" target="_blank">
                                <img src="${CONFIG.ASSETS}icon/google.png" alt="Google" class="icona-app">Google
                            </a>
                        </p>
                    </p>
                    <p class="footer-qr">
                        <a href="${CONFIG.ASSETS}${CONFIG.QR}">
                            <img src="${CONFIG.ASSETS}${CONFIG.QR}" alt="QR">
                        </a>
                    </p>
                    <p class="footer-poweredby">
                        Powered by <a href="https://www.altervector.com" target="_blank">AlterVector</a>
                        <!-- #visites s'omple via Worker (BLOC 6) -->
                        <span id="visites"></span>
                    </p>
                </footer>
            `;
        }


       



        /* ─── 5. NAVBAR SCROLL ───────────────────────────────────── */
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.navbar');
            if (nav) {
                nav.classList.toggle('scrolled', window.scrollY > 50);
            }
        });
    // ─── BLOQUEJAR MENÚ CONTEXTUAL ───────────────────────
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    /* ─── 6. VISITES ─────────────────────────────────────────── */
        fetch(`${CONFIG.BASE_WORKER}/visites`)
            .then(r => r.json())
            .then(data => {
                const el = document.getElementById('visites');
                if (el && data.visites) {
                    el.textContent = `${data.visites} visites`;
                }
            })
            .catch(() => {}); // silenciós si falla

            // ─── CADUCITAT ───────────────────────────────────────
            try {
                const res = await fetch(`${CONFIG.BASE_WORKER}/caducitat`);
                const data = await res.text();
                if (new Date() > new Date(data)) {
                    const capa = document.createElement('div');
                    capa.id = 'capa-bloqueig';
                    capa.innerHTML = ` 
                <style>
                    #capa-bloqueig {
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(2px);
                        -webkit-backdrop-filter: blur(2px); z-index: 100000; 
                        display: flex; align-items: center; justify-content: center; padding: 20px;
                    }
                   .caixa-neta-glass {
                        background: rgba(255, 240, 220, 0.75); backdrop-filter: blur(15px);
                        -webkit-backdrop-filter: blur(15px); padding: 50px; border-radius: 20px; text-align: center;
                        max-width: 420px; width: 100%; box-shadow: 0 15px 45px rgba(211, 84, 0, 0.15);
                        border: 1px solid rgba(211, 84, 0, 0.2); font-family: sans-serif;
                    }
                   .caixa-neta-glass h2 { color: #d35400; margin-top: 0; font-size: 1.7rem; font-weight: 800; }
                   .caixa-neta-glass p { color: #333; line-height: 1.6; font-size: 1.05rem; }
                </style>
                <div class="caixa-neta-glass">
                    <h2>Avís del Sistema</h2>
                    <p>S'ha acabat el període de prova d'aquest catàleg digital.</p>
                    <div style="margin-top: 35px;">
                        <a href="javascript:history.back()" style="background: #d35400; color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Tornar enrere</a>
                    </div>
                </div>`; // el disseny de la capa
                    document.body.appendChild(capa);
                }
            } catch(e) {}
    
    }; // fi inicialitzar

    if (document.readyState === "complete" || document.readyState === "interactive") {
        inicialitzar();
    } else {
        document.addEventListener("DOMContentLoaded", inicialitzar);
    }

})();
