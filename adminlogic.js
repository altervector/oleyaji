/* ============================================================
   ADMINLOGIC.JS - Panel d'administració de Olé y Ají
   Depèn de: config.js, api.js
   Columnes: Visible, Nom, Preu, Categoria, Descripcio, Foto
   ============================================================ */

(function() {

    // ─── ESTILS ──────────────────────────────────────────────
    const estils = document.createElement('style');
    estils.textContent = `
        * { box-sizing: border-box; margin: 0; padding: 0; }

        html {
            background-image: none;
            background: #1a1a2e;
        }

        body {
            background: #1a1a2e;
            color: #eee;
            font-family: 'Segoe UI', sans-serif;
            font-size: 13px;
            padding: 20px;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 700px;
        }

        thead tr {
            background: #2c3e35;
            color: #c8973a;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 11px;
        }

        th {
            position: sticky;
            top: 48px;
            z-index: 10;
            background: #2c3e35;
        }

        th, td {
            padding: 8px 10px;
            border-bottom: 1px solid #2a2a3e;
            text-align: left;
            white-space: nowrap;
        }

        tbody tr:hover {
            background: #22223a;
        }

        tbody tr.guardant {
            background: #2c3e20;
        }

        tbody tr.fila-nova {
            background: #1a2a1a;
        }

        input[type="text"],
        input[type="number"],
        select {
            background: transparent;
            border: none;
            color: #eee;
            font-size: 13px;
            width: 100%;
            outline: none;
            padding: 2px 4px;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        select:focus {
            background: #2a2a4a;
            border-bottom: 1px solid #c8973a;
        }

        /* ─── Eliminar fletxes del camp preu (tots els navegadors) ─── */
        input[type="number"] {
            -moz-appearance: textfield;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #c8973a;
        }

        .col-nom       { min-width: 160px; }
        .col-preu      { width: 70px; }
        .col-check     { width: 80px; text-align: center; }
        .col-categoria { width: 110px; }
        .col-descripcio{ min-width: 180px; }
        .col-foto      { width: 90px; text-align: center; }

        /* ─── BARRA STICKY ─── */
        #admin-barra {
            position: sticky;
            top: 0;
            z-index: 20;
            background: #0d0d1a;
            border-bottom: 1px solid #2a2a3e;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            margin: -20px -20px 10px -20px;
        }

        #btn-guardar {
            background: #2c3e35;
            color: #555;
            border: 1px solid #555;
            padding: 6px 16px;
            font-size: 12px;
            letter-spacing: 1px;
            cursor: not-allowed;
            text-transform: uppercase;
        }

        #btn-guardar.actiu {
            color: #c8973a;
            border-color: #c8973a;
            cursor: pointer;
        }

        #btn-guardar.actiu:hover {
            background: #c8973a;
            color: #1a1a2e;
        }

        #btn-descartar {
            background: none;
            color: #555;
            border: 1px solid #333;
            padding: 6px 16px;
            font-size: 12px;
            letter-spacing: 1px;
            cursor: not-allowed;
            text-transform: uppercase;
        }

        #btn-descartar.actiu {
            color: #e74c3c;
            border-color: #e74c3c;
            cursor: pointer;
        }

        #btn-descartar.actiu:hover {
            background: #e74c3c;
            color: white;
        }

        #admin-comptador {
            font-size: 11px;
            color: #555;
            letter-spacing: 1px;
        }

        #admin-estat {
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            font-size: 16px;
            font-weight: bold;
            color: #c8973a;
            letter-spacing: 1px;
            border: 0px solid #c8973a;
            padding: 6px 16px;
            pointer-events: none;
        }

        /* ─── CEL·LA AMB CANVI PENDENT ─── */
        .pendent {
            outline: 2px solid #ff0000 !important;
        }

        /* ─── MINIATURA FOTO ─── */
        .foto-thumb {
            width: 48px;
            height: 48px;
            object-fit: cover;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid #333;
            display: block;
            margin: 0 auto;
        }

        .foto-thumb:hover {
            border-color: #c8973a;
        }

        /* Placeholder quan no hi ha foto */
        .foto-buit {
            width: 48px;
            height: 48px;
            border: 1px dashed #555;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin: 0 auto;
            font-size: 18px;
            color: #555;
        }

        .foto-buit:hover {
            border-color: #c8973a;
            color: #c8973a;
        }

        /* Missatge d'estat de pujada dins la cel·la */
        .foto-estat {
            font-size: 10px;
            color: #c8973a;
            text-align: center;
            margin-top: 3px;
            min-height: 14px;
        }
    `;
    document.head.appendChild(estils);

    // ─── VARIABLES ───────────────────────────────────────────
    let registres = [];
    window.CANVIS_PENDENTS = {};

    // ─── ACTUALITZAR BARRA ───────────────────────────────────
    const actualitzarBarra = () => {
        const total = Object.values(window.CANVIS_PENDENTS).reduce((acc, dades) => acc + Object.keys(dades).length, 0);
        const btnGuardar  = document.getElementById('btn-guardar');
        const btnDescartar = document.getElementById('btn-descartar');
        const comptador   = document.getElementById('admin-comptador');
        if (!btnGuardar) return;

        if (total > 0) {
            btnGuardar.classList.add('actiu');
            btnDescartar.classList.add('actiu');
            comptador.textContent = `${total} canvi${total > 1 ? 's' : ''} pendent${total > 1 ? 's' : ''}`;
        } else {
            btnGuardar.classList.remove('actiu');
            btnDescartar.classList.remove('actiu');
            comptador.textContent = '';
        }
    };

    // ─── MARCAR CEL·LA COM A PENDENT ─────────────────────────
    const marcarPendent   = (el) => el.classList.add('pendent');
    const desmarcarPendents = () => {
        document.querySelectorAll('.pendent').forEach(el => el.classList.remove('pendent'));
    };

    // ─── ACUMULAR CANVI AL BUFFER ────────────────────────────
    const acumularCanvi = (id, dades, el) => {
        if (!id) return;
        if (!window.CANVIS_PENDENTS[id]) window.CANVIS_PENDENTS[id] = {};
        Object.assign(window.CANVIS_PENDENTS[id], dades);
        marcarPendent(el);
        actualitzarBarra();
    };

    // ─── GUARDAR TOT (PUSH PER LOTS DE 10) ───────────────────
    const guardarTot = async () => {
        const estat   = document.getElementById('admin-estat');
        const entrades = Object.entries(window.CANVIS_PENDENTS);
        if (entrades.length === 0) return;

        estat.textContent = '⏳ Guardant...';

        const lots = [];
        for (let i = 0; i < entrades.length; i += 10) {
            lots.push(entrades.slice(i, i + 10));
        }

        let totOk = true;
        for (const lot of lots) {
            for (const [id, dades] of lot) {
                try {
                    const res = await fetch(CONFIG.BASE_WORKER, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, ...dades })
                    });
                    if (!res.ok) totOk = false;
                } catch (e) {
                    totOk = false;
                }
            }
        }

        if (totOk) {
            window.CANVIS_PENDENTS = {};
            desmarcarPendents();
            actualitzarBarra();
            estat.textContent = '✅ Tot guardat';
            setTimeout(() => estat.textContent = '', 2000);
        } else {
            estat.textContent = '❌ Algun canvi no s\'ha guardat';
        }
    };

    // ─── DESCARTAR CANVIS ────────────────────────────────────
    const descartarCanvis = () => {
        window.CANVIS_PENDENTS = {};
        location.reload();
    };


    // ─── GESTIÓ DE FOTOS (CLOUDINARY) ────────────────────────

    // Construeix la URL de previsualització a partir del nom guardat a Airtable
    // Ex: "productos/nom-plat.jpg" → URL completa de Cloudinary
    const urlThumb = (nomFoto) => {
        if (!nomFoto) return '';
        // Si ja és una URL completa, la retornem tal qual
        if (nomFoto.startsWith('http')) return nomFoto;
        return `https://res.cloudinary.com/${CONFIG.CLOUDI_NAME}/image/upload/w_100,c_fill/${nomFoto}`;
    };

    // Gestiona la selecció d'un arxiu: mostra preview local i canvia el botó a "Confirmar"
    const prepararSubidaFoto = (input, id, tdFoto) => {
        if (!input.files || !input.files[0]) return;
        const arxiu = input.files[0];
        const nomOriginal = arxiu.name;
        const reader = new FileReader();

        reader.onload = (e) => {
            // Mostrem preview local mentre es confirma
            const thumb = tdFoto.querySelector('.foto-thumb, .foto-buit');
            if (thumb) thumb.src = e.target.result;

            const estat = tdFoto.querySelector('.foto-estat');
            if (estat) {
                estat.textContent = '💾 Confirmar?';
                estat.style.cursor = 'pointer';
                estat.onclick = () => executarSubidaFoto(id, e.target.result, nomOriginal, tdFoto);
            }
        };
        reader.readAsDataURL(arxiu);
    };

    // Redimensiona, puja a Cloudinary i acumula el canvi al buffer
    const executarSubidaFoto = async (id, base64, nomOriginal, tdFoto) => {
        const estat = tdFoto.querySelector('.foto-estat');
        if (estat) { estat.textContent = '⏳ Pujant...'; estat.style.cursor = 'default'; estat.onclick = null; }

        try {
            // Redimensionar a màx 1080px mantenint proporció
            const img = new Image();
            img.src = base64;
            await img.decode();

            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            const MAX = 1080;
            if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
            else       { if (h > MAX) { w *= MAX / h; h = MAX; } }
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));

            const formData = new FormData();
            formData.append('file', blob, `${Date.now()}.jpg`);
            formData.append('upload_preset', 'ml_default');

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDI_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.secure_url) {
                const nomFinal = data.public_id + '.' + data.format;

                // Actualitzem la miniatura amb la URL real de Cloudinary
                const thumb = tdFoto.querySelector('img.foto-thumb');
                if (thumb) thumb.src = urlThumb(nomFinal);

                // Acumulem el canvi al buffer igual que qualsevol altre camp
                acumularCanvi(id, { Foto: nomFinal }, tdFoto);

                if (estat) estat.textContent = '✅ Foto pendent de guardar';
            } else {
                throw new Error('Cloudinary no ha retornat URL');
            }
        } catch (error) {
            console.error('Error pujant foto:', error);
            if (estat) estat.textContent = '❌ Error pujant';
        }
    };


    // ─── CREAR FILA ──────────────────────────────────────────
    const crearFila = (r, esNova = false) => {
        const f  = r.fields || {};
        const id = r.id || null;

        const getCategoria = (c) => Array.isArray(c) ? c[0] : (c || 'Plats');
        const getFoto      = (foto) => Array.isArray(foto) ? foto[0] : (foto || '');

        const fila = document.createElement('tr');
        if (id) fila.setAttribute('data-id', id);
        if (esNova) fila.classList.add('fila-nova');

        const categories = ['Plats', 'Tapas', 'Postres', 'Begudes'];

        // ─── Helpers d'esdeveniments ────────────────────────
        const onBlurText = (camp, el) => {
            const valorOriginal = el.value;
            el.addEventListener('blur', () => {
                if (el.value !== valorOriginal) acumularCanvi(id, { [camp]: el.value }, el);
            });
        };

        const onBlurNum = (camp, el) => {
            const valorOriginal = parseFloat(el.value) || 0;
            el.addEventListener('blur', () => {
                const valorNou = parseFloat(el.value) || 0;
                if (valorNou !== valorOriginal) acumularCanvi(id, { [camp]: valorNou }, el);
            });
        };

        const onChangeCheck = (camp, el) => {
            const valorOriginal = el.checked;
            el.addEventListener('change', () => {
                if (el.checked !== valorOriginal) acumularCanvi(id, { [camp]: el.checked }, el);
            });
        };

        const onChangeSel = (camp, el) => {
            const valorOriginal = el.value;
            el.addEventListener('change', () => {
                if (el.value !== valorOriginal) acumularCanvi(id, { [camp]: [el.value] }, el);
            });
        };

        // ─── Visible ────────────────────────────────────────
        const cbVisible = document.createElement('input');
        cbVisible.type    = 'checkbox';
        cbVisible.checked = f.Visible === true;
        onChangeCheck('Visible', cbVisible);
        const tdVisible = document.createElement('td');
        tdVisible.className = 'col-check';
        tdVisible.appendChild(cbVisible);

        // ─── Nom ─────────────────────────────────────────────
        const inputNom = document.createElement('input');
        inputNom.type        = 'text';
        inputNom.value       = f.Nom || '';
        inputNom.placeholder = esNova ? 'Escriu el nom i prem Tab...' : '';

        if (esNova) {
            inputNom.addEventListener('blur', async () => {
                if (!inputNom.value.trim()) return;
                const estat = document.getElementById('admin-estat');
                estat.textContent = '⏳ Creant plat...';
                try {
                    const res = await fetch(CONFIG.BASE_WORKER, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            Nom:       inputNom.value.trim(),
                            Preu:      0,
                            Categoria: ['Plats'],
                            Visible:   false
                        })
                    });
                    if (res.ok) {
                        estat.textContent = '✅ Plat creat — recarregant...';
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        estat.textContent = '❌ Error al crear';
                    }
                } catch (e) {
                    estat.textContent = '❌ Error de connexió';
                }
            });
        } else {
            onBlurText('Nom', inputNom);
        }

        const tdNom = document.createElement('td');
        tdNom.className = 'col-nom';
        tdNom.appendChild(inputNom);

        // ─── Preu ─────────────────────────────────────────────
        const inputPreu = document.createElement('input');
        inputPreu.type  = 'number';
        inputPreu.step  = '0.01';
        inputPreu.value = f.Preu || 0;
        onBlurNum('Preu', inputPreu);
        const tdPreu = document.createElement('td');
        tdPreu.className = 'col-preu';
        tdPreu.appendChild(inputPreu);

        // ─── Categoria (select) ───────────────────────────────
        const sel = document.createElement('select');
        categories.forEach(c => {
            const opt = document.createElement('option');
            opt.value       = c;
            opt.textContent = c;
            if (getCategoria(f.Categoria) === c) opt.selected = true;
            sel.appendChild(opt);
        });
        onChangeSel('Categoria', sel);
        const tdCategoria = document.createElement('td');
        tdCategoria.className = 'col-categoria';
        tdCategoria.appendChild(sel);

        // ─── Descripcio ───────────────────────────────────────
        const inputDesc = document.createElement('input');
        inputDesc.type  = 'text';
        inputDesc.value = f.Descripcio || '';
        onBlurText('Descripcio', inputDesc);
        const tdDesc = document.createElement('td');
        tdDesc.className = 'col-descripcio';
        tdDesc.appendChild(inputDesc);

        // ─── Foto (miniatura + upload Cloudinary) ─────────────
        // La cel·la conté: miniatura (o placeholder) + input file ocult + línia d'estat
        const nomFoto = getFoto(f.Foto);
        const tdFoto  = document.createElement('td');
        tdFoto.className = 'col-foto';

        // Input file ocult — s'activa en clicar la miniatura
        const inputFile = document.createElement('input');
        inputFile.type   = 'file';
        inputFile.accept = 'image/*';
        inputFile.style.display = 'none';
        inputFile.addEventListener('change', () => prepararSubidaFoto(inputFile, id, tdFoto));

        // Miniatura o placeholder segons si ja hi ha foto
        let visorFoto;
        if (nomFoto) {
            visorFoto     = document.createElement('img');
            visorFoto.src = urlThumb(nomFoto);
            visorFoto.className = 'foto-thumb';
            visorFoto.alt = 'foto';
        } else {
            visorFoto           = document.createElement('div');
            visorFoto.className = 'foto-buit';
            visorFoto.textContent = '📷';
        }
        // Clicar la miniatura (o placeholder) obre el selector de fitxer
        visorFoto.addEventListener('click', () => inputFile.click());

        // Línia d'estat petita sota la miniatura
        const divEstat = document.createElement('div');
        divEstat.className = 'foto-estat';

        tdFoto.appendChild(inputFile);
        tdFoto.appendChild(visorFoto);
        tdFoto.appendChild(divEstat);

        // ─── Afegir columnes a la fila ────────────────────────
        fila.appendChild(tdVisible);
        fila.appendChild(tdNom);
        fila.appendChild(tdPreu);
        fila.appendChild(tdCategoria);
        fila.appendChild(tdDesc);
        fila.appendChild(tdFoto);

        return fila;
    };

    // ─── MOSTRAR LOGIN ───────────────────────────────────────
    const mostrarLogin = () => {
        document.body.style.opacity = '1';
        const panel = document.getElementById('admin-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div style="
                display: flex; align-items: center; justify-content: center;
                min-height: 100vh; padding: 20px; margin: -20px;">
                <div style="
                    background: #0d0d1a; border: 1px solid #c8973a;
                    padding: 40px 30px; width: 90%; max-width: 320px;
                    text-align: center; font-family: 'Segoe UI', sans-serif;">
                    <img src="${CONFIG.BASE_URL}${CONFIG.LOGO}" alt="${CONFIG.NOM}"
                        style="height:60px; margin: 0 auto 20px auto; display:block;">
                    <p style="color:#c8973a; letter-spacing:2px; text-transform:uppercase;
                        font-size:12px; margin-bottom:20px;">Accés restringit</p>
                    <input id="login-input" type="text" placeholder="Contrasenya"
                        autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                        style="width:100%; padding:10px; background:#0d0d1a; border:1px solid #444;
                        color:#eee; font-size:14px; outline:none; margin-bottom:12px;
                        text-align:center; letter-spacing:2px; -webkit-text-security: disc;">
                    <button id="login-boto"
                        style="width:100%; padding:10px; background:#2c3e35; color:#c8973a;
                        border:1px solid #c8973a; font-size:13px; letter-spacing:1px;
                        cursor:pointer; text-transform:uppercase;">
                        Entrar
                    </button>
                    <p id="login-error" style="color:#e74c3c; font-size:12px;
                        margin-top:12px; min-height:18px;"></p>
                    <button onclick="history.back()"
                        style="margin-top:16px; background:none; border:none;
                        color:#555; font-size:12px; cursor:pointer; letter-spacing:1px;">
                        Cancel·lar
                    </button>
                </div>
            </div>
        `;

        const fer_login = async () => {
            const input = document.getElementById('login-input');
            const error = document.getElementById('login-error');
            const clau  = input.value.trim();
            if (!clau) return;
            error.textContent = '⏳ Verificant...';
            try {
                const res  = await fetch(`${CONFIG.BASE_WORKER}/login?p=${encodeURIComponent(clau)}`);
                const text = await res.text();
                if (text.trim() === 'OK') {
                    sessionStorage.setItem('admin_clau', clau);
                    mostrarTaula();
                } else {
                    error.textContent = '❌ Clau incorrecta';
                    input.value = '';
                    input.focus();
                }
            } catch (e) {
                error.textContent = '❌ Error de connexió';
            }
        };

        document.getElementById('login-boto').addEventListener('click', fer_login);
        document.getElementById('login-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') fer_login();
        });

        setTimeout(() => document.getElementById('login-input').focus(), 100);
    };

    // ─── MOSTRAR TAULA ───────────────────────────────────────
    const mostrarTaula = async () => {
        const panel = document.getElementById('admin-panel');
        if (!panel) return;

        if (!document.getElementById('admin-estat')) {
            const divEstat = document.createElement('div');
            divEstat.id = 'admin-estat';
            document.body.appendChild(divEstat);
        }

        panel.innerHTML = `
            <div id="admin-barra">
                <button id="btn-guardar">💾 Guardar</button>
                <button id="btn-descartar">✕ Descartar</button>
                <span id="admin-comptador"></span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th class="col-check">Visible</th>
                        <th class="col-nom">Nom</th>
                        <th class="col-preu">Preu</th>
                        <th class="col-categoria">Categoria</th>
                        <th class="col-descripcio">Descripció</th>
                        <th class="col-foto">Foto</th>
                    </tr>
                </thead>
                <tbody id="admin-tbody"></tbody>
            </table>
        `;

        document.getElementById('btn-guardar').addEventListener('click', () => {
            if (Object.keys(window.CANVIS_PENDENTS).length > 0) guardarTot();
        });

        document.getElementById('btn-descartar').addEventListener('click', () => {
            if (Object.keys(window.CANVIS_PENDENTS).length > 0) descartarCanvis();
        });

        const res  = await fetch(CONFIG.BASE_WORKER);
        const data = await res.json();
        registres  = data;

        const tbody = document.getElementById('admin-tbody');
        registres.forEach(r => tbody.appendChild(crearFila(r)));
        // Fila buida a dalt per crear nous plats
        tbody.prepend(crearFila({ fields: {}, id: null }, true));

        document.body.style.opacity = '1';
    };

    // ─── INICIALITZAR ────────────────────────────────────────
    const inicialitzar = async () => {
        const clau = sessionStorage.getItem('admin_clau');
        if (clau) {
            const resLogin = await fetch(`${CONFIG.BASE_WORKER}/login?p=${encodeURIComponent(clau)}`);
            const text     = await resLogin.text();
            if (text.trim() === 'OK') {
                mostrarTaula();
                return;
            }
        }
        mostrarLogin();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        inicialitzar();
    } else {
        document.addEventListener('DOMContentLoaded', inicialitzar);
    }

})();