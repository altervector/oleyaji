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

        #btn-nou {
            background: none;
            color: #c8973a;
            border: 1px solid #c8973a;
            padding: 6px 16px;
            font-size: 12px;
            letter-spacing: 1px;
            cursor: pointer;
            text-transform: uppercase;
        }

        #btn-nou:hover {
            background: #c8973a;
            color: #1a1a2e;
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
            padding: 6px 16px;
            pointer-events: none;
        }

        /* ─── CEL·LA AMB CANVI PENDENT ─── */
        .pendent {
            outline: 2px solid #ff0000 !important;
        }

        /* ─── FILA MARCADA PER ELIMINAR ─── */
        tr.per-eliminar td {
            opacity: 0.4;
            text-decoration: line-through;
        }

        /* ─── BOTÓ DELETE ─── */
        .btn-delete {
            background: none;
            border: none;
            color: #555;
            font-size: 15px;
            cursor: pointer;
            padding: 2px 6px;
            line-height: 1;
        }

        .btn-delete:hover {
            color: #e74c3c;
        }

        .btn-delete.marcat {
            color: #e74c3c;
        }

        .col-delete { width: 40px; text-align: center; }

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

        .foto-estat {
            font-size: 10px;
            color: #c8973a;
            text-align: center;
            margin-top: 3px;
            min-height: 14px;
        }

        /* ─── MODAL NOU PLAT ─── */
        #modal-nou-plat {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 999;
            align-items: center;
            justify-content: center;
        }

        #modal-nou-plat .modal-caixa {
            background: #0d0d1a;
            border: 1px solid #c8973a;
            width: 90%;
            max-width: 420px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            font-family: 'Segoe UI', sans-serif;
        }

        #modal-nou-plat h2 {
            color: #c8973a;
            font-size: 13px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: normal;
            margin: 0;
        }

        #modal-nou-plat input[type="text"],
        #modal-nou-plat input[type="number"],
        #modal-nou-plat select,
        #modal-nou-plat textarea {
            width: 100%;
            background: #1a1a2e;
            border: 1px solid #333;
            color: #eee;
            font-size: 13px;
            padding: 8px 10px;
            outline: none;
            font-family: 'Segoe UI', sans-serif;
            border-radius: 0;
        }

        #modal-nou-plat input:focus,
        #modal-nou-plat select:focus,
        #modal-nou-plat textarea:focus {
            border-color: #c8973a;
        }

        #modal-nou-plat textarea {
            height: 70px;
            resize: vertical;
        }

        #modal-nou-plat .modal-fila {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #modal-nou-plat .modal-boto-crear {
            background: #2c3e35;
            color: #555;
            border: 1px solid #555;
            padding: 10px;
            font-size: 12px;
            letter-spacing: 1px;
            text-transform: uppercase;
            cursor: not-allowed;
            width: 100%;
        }

        #modal-nou-plat .modal-boto-crear.actiu {
            color: #c8973a;
            border-color: #c8973a;
            cursor: pointer;
        }

        #modal-nou-plat .modal-boto-crear.actiu:hover {
            background: #c8973a;
            color: #1a1a2e;
        }

        #modal-nou-plat .modal-boto-cancel {
            background: none;
            border: none;
            color: #555;
            font-size: 12px;
            cursor: pointer;
            letter-spacing: 1px;
            text-align: center;
            width: 100%;
            padding: 6px;
        }

        #modal-nou-plat .modal-boto-cancel:hover {
            color: #e74c3c;
        }

        /* ─── ZONA FOTO DEL MODAL ─── */
        #modal-foto-zona {
            width: 100%;
            height: 160px;
            background: #1a1a2e;
            border: 2px solid #c8973a;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            overflow: hidden;
            transition: background 0.2s;
        }

        #modal-foto-zona:hover {
            background: #1f1f3a;
        }

        #modal-foto-zona img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        #modal-foto-zona .foto-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            color: #c8973a;
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        #modal-foto-zona .foto-placeholder span {
            font-size: 36px;
        }

        #modal-foto-estat {
            font-size: 11px;
            color: #c8973a;
            text-align: center;
            min-height: 16px;
            letter-spacing: 1px;
        }
    `;
    document.head.appendChild(estils);

    // ─── VARIABLES ───────────────────────────────────────────
    let registres = [];
    window.CANVIS_PENDENTS = {};
    let nomFotoNouPlat = ''; // foto pujada al modal fins que es crea el registre

    // ─── ACTUALITZAR BARRA ───────────────────────────────────
    const actualitzarBarra = () => {
        const total = Object.values(window.CANVIS_PENDENTS).reduce((acc, dades) => acc + Object.keys(dades).length, 0);
        const btnGuardar   = document.getElementById('btn-guardar');
        const btnDescartar = document.getElementById('btn-descartar');
        const comptador    = document.getElementById('admin-comptador');
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
    const marcarPendent     = (el) => el.classList.add('pendent');
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
        const estat    = document.getElementById('admin-estat');
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


    // ─── GESTIÓ DE FOTOS — TAULA ─────────────────────────────

    const urlThumb = (nomFoto) => {
        if (!nomFoto) return '';
        if (nomFoto.startsWith('http')) return nomFoto;
        return `https://res.cloudinary.com/${CONFIG.CLOUDI_NAME}/image/upload/w_100,c_fill/${nomFoto}`;
    };

    const prepararSubidaFoto = (input, id, tdFoto) => {
        if (!input.files || !input.files[0]) return;
        const arxiu = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const thumb = tdFoto.querySelector('.foto-thumb, .foto-buit');
            if (thumb) thumb.src = e.target.result;
            const estat = tdFoto.querySelector('.foto-estat');
            if (estat) {
                estat.textContent = '💾 Confirmar?';
                estat.style.cursor = 'pointer';
                estat.onclick = () => executarSubidaFoto(id, e.target.result, arxiu.name, tdFoto);
            }
        };
        reader.readAsDataURL(arxiu);
    };

    const executarSubidaFoto = async (id, base64, nomOriginal, tdFoto) => {
        const estat = tdFoto.querySelector('.foto-estat');
        if (estat) { estat.textContent = '⏳ Pujant...'; estat.style.cursor = 'default'; estat.onclick = null; }
        try {
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
            const res  = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDI_NAME}/image/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            console.log(data)                       //xxx//
            if (data.secure_url) {
                const nomFinal = data.public_id + '.' + data.format;
                const thumb = tdFoto.querySelector('img.foto-thumb');
                if (thumb) thumb.src = urlThumb(nomFinal);
                acumularCanvi(id, { Foto: nomFinal }, tdFoto);
                if (estat) estat.textContent = '✅ Foto pendent de guardar';
            } else { throw new Error('Cloudinary no ha retornat URL'); }
        } catch (error) {
            console.error('Error pujant foto:', error);
            if (estat) estat.textContent = '❌ Error pujant';
        }
    };


    // ─── GESTIÓ DE FOTOS — MODAL NOU PLAT ───────────────────

    const prepararFotoModal = (input) => {
        if (!input.files || !input.files[0]) return;
        const arxiu = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('modal-foto-zona').innerHTML = `<img src="${e.target.result}" alt="preview">`;
            const estat = document.getElementById('modal-foto-estat');
            estat.textContent = '💾 Confirmar foto?';
            estat.style.cursor = 'pointer';
            estat.onclick = () => executarFotoModal(e.target.result, arxiu.name);
        };
        reader.readAsDataURL(arxiu);
    };

    const executarFotoModal = async (base64, nomOriginal) => {
        const estat = document.getElementById('modal-foto-estat');
        estat.textContent = '⏳ Pujant foto...';
        estat.style.cursor = 'default';
        estat.onclick = null;
        try {
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
            const res  = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDI_NAME}/image/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.secure_url) {
                nomFotoNouPlat = data.public_id + '.' + data.format;
                estat.textContent = '✅ Foto llesta';

                // Ara que tenim foto, activem el botó Crear si també hi ha nom
                const nom = document.getElementById('modal-nom').value.trim();
                if (nom) {
                    const btnCrear = document.getElementById('modal-btn-crear');
                    btnCrear.classList.add('actiu');
                    btnCrear.disabled = false;
                }
                // Amaguem l'avís de foto obligatòria
                const avis = document.getElementById('modal-avis-foto');
                if (avis) avis.style.display = 'none';
            } else { throw new Error('Cloudinary no ha retornat URL'); }
        } catch (error) {
            console.error('Error pujant foto:', error);
            document.getElementById('modal-foto-estat').textContent = '❌ Error pujant';
        }
    };


    // ─── MODAL NOU PLAT ──────────────────────────────────────

    const obrirModalNouPlat = () => {
        nomFotoNouPlat = '';
        document.getElementById('modal-nom').value       = '';
        document.getElementById('modal-preu').value      = '';
        document.getElementById('modal-categoria').value = 'Plats';
        document.getElementById('modal-desc').value      = '';
        document.getElementById('modal-visible').checked = true;
        document.getElementById('modal-foto-estat').textContent = '';
        document.getElementById('modal-foto-zona').innerHTML = `
            <div class="foto-placeholder"><span>📷</span>SELECCIONAR FOTO</div>`;
        const btnCrear = document.getElementById('modal-btn-crear');
        btnCrear.classList.remove('actiu');
        btnCrear.disabled = true;
        btnCrear.textContent = 'CREAR PLAT';
        document.getElementById('modal-nou-plat').style.display = 'flex';
        setTimeout(() => document.getElementById('modal-nom').focus(), 100);
    };

    const tancarModalNouPlat = () => {
        document.getElementById('modal-nou-plat').style.display = 'none';
        nomFotoNouPlat = '';
    };

    const crearNouPlat = async () => {
        const nom = document.getElementById('modal-nom').value.trim();
        if (!nom) return;

        const dades = {
            Nom:        nom,
            Preu:       parseFloat(document.getElementById('modal-preu').value.replace(',', '.')) || 0,
            Categoria:  [document.getElementById('modal-categoria').value],
            Descripcio: document.getElementById('modal-desc').value.trim(),
            Visible:    document.getElementById('modal-visible').checked
        };
        if (nomFotoNouPlat) dades.Foto = nomFotoNouPlat;

        const btnCrear = document.getElementById('modal-btn-crear');
        btnCrear.textContent = '⏳ Creant...';
        btnCrear.classList.remove('actiu');
        btnCrear.disabled = true;

        try {
            const res = await fetch(CONFIG.BASE_WORKER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dades)
            });
            if (res.ok) {
                tancarModalNouPlat();
                location.reload();
            } else {
                btnCrear.textContent = 'CREAR PLAT';
                btnCrear.classList.add('actiu');
                btnCrear.disabled = false;
                document.getElementById('admin-estat').textContent = '❌ Error al crear';
            }
        } catch (e) {
            btnCrear.textContent = 'CREAR PLAT';
            btnCrear.classList.add('actiu');
            btnCrear.disabled = false;
            document.getElementById('admin-estat').textContent = '❌ Error de connexió';
        }
    };

    // El botó Crear s'activa només quan hi ha nom I foto pujada
    const nomInputHandler = () => {
        const nom      = document.getElementById('modal-nom').value.trim();
        const btnCrear = document.getElementById('modal-btn-crear');
        if (nom && nomFotoNouPlat) {
            btnCrear.classList.add('actiu');
            btnCrear.disabled = false;
        } else {
            btnCrear.classList.remove('actiu');
            btnCrear.disabled = true;
        }
    };


    // ─── CREAR FILA (registres existents) ────────────────────
    const crearFila = (r) => {
        const f  = r.fields || {};
        const id = r.id || null;

        const getCategoria = (c) => Array.isArray(c) ? c[0] : (c || 'Plats');
        const getFoto      = (foto) => Array.isArray(foto) ? foto[0] : (foto || '');

        const fila = document.createElement('tr');
        if (id) fila.setAttribute('data-id', id);

        const categories = ['Plats', 'Tapas', 'Postres', 'Begudes'];

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

        // Visible
        const cbVisible = document.createElement('input');
        cbVisible.type    = 'checkbox';
        cbVisible.checked = f.Visible === true;
        onChangeCheck('Visible', cbVisible);
        const tdVisible = document.createElement('td');
        tdVisible.className = 'col-check';
        tdVisible.appendChild(cbVisible);

        // Nom
        const inputNom = document.createElement('input');
        inputNom.type  = 'text';
        inputNom.value = f.Nom || '';
        onBlurText('Nom', inputNom);
        const tdNom = document.createElement('td');
        tdNom.className = 'col-nom';
        tdNom.appendChild(inputNom);

        // Preu
        const inputPreu = document.createElement('input');
        inputPreu.type  = 'number';
        inputPreu.step  = '0.01';
        inputPreu.value = f.Preu || 0;
        onBlurNum('Preu', inputPreu);
        const tdPreu = document.createElement('td');
        tdPreu.className = 'col-preu';
        tdPreu.appendChild(inputPreu);

        // Categoria
        const sel = document.createElement('select');
        categories.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c; opt.textContent = c;
            if (getCategoria(f.Categoria) === c) opt.selected = true;
            sel.appendChild(opt);
        });
        onChangeSel('Categoria', sel);
        const tdCategoria = document.createElement('td');
        tdCategoria.className = 'col-categoria';
        tdCategoria.appendChild(sel);

        // Descripcio
        const inputDesc = document.createElement('input');
        inputDesc.type  = 'text';
        inputDesc.value = f.Descripcio || '';
        onBlurText('Descripcio', inputDesc);
        const tdDesc = document.createElement('td');
        tdDesc.className = 'col-descripcio';
        tdDesc.appendChild(inputDesc);

        // Foto
        const nomFoto = getFoto(f.Foto);
        const tdFoto  = document.createElement('td');
        tdFoto.className = 'col-foto';

        const inputFile = document.createElement('input');
        inputFile.type   = 'file';
        inputFile.accept = 'image/*';
        inputFile.style.display = 'none';
        inputFile.addEventListener('change', () => prepararSubidaFoto(inputFile, id, tdFoto));

        let visorFoto;
        if (nomFoto) {
            visorFoto = document.createElement('img');
            visorFoto.src = urlThumb(nomFoto);
            visorFoto.className = 'foto-thumb';
            visorFoto.alt = 'foto';
        } else {
            visorFoto = document.createElement('div');
            visorFoto.className = 'foto-buit';
            visorFoto.textContent = '📷';
        }
        visorFoto.addEventListener('click', () => inputFile.click());

        const divEstat = document.createElement('div');
        divEstat.className = 'foto-estat';

        tdFoto.appendChild(inputFile);
        tdFoto.appendChild(visorFoto);
        tdFoto.appendChild(divEstat);

        // ─── Botó eliminar ────────────────────────────────
        const btnDel = document.createElement('button');
        btnDel.className   = 'btn-delete';
        btnDel.textContent = '🗑';
        btnDel.title       = 'Marcar per eliminar';
        btnDel.addEventListener('click', () => {
            if (fila.classList.contains('per-eliminar')) {
                // Desmarcar — treure del buffer
                fila.classList.remove('per-eliminar');
                btnDel.classList.remove('marcat');
                if (window.CANVIS_PENDENTS[id]) {
                    delete window.CANVIS_PENDENTS[id];
                    actualitzarBarra();
                }
            } else {
                // Marcar per eliminar — afegir al buffer
                fila.classList.add('per-eliminar');
                btnDel.classList.add('marcat');
                acumularCanvi(id, { _delete: true }, btnDel);
            }
        });
        const tdDelete = document.createElement('td');
        tdDelete.className = 'col-delete';
        tdDelete.appendChild(btnDel);

        fila.appendChild(tdVisible);
        fila.appendChild(tdNom);
        fila.appendChild(tdPreu);
        fila.appendChild(tdCategoria);
        fila.appendChild(tdDesc);
        fila.appendChild(tdFoto);
        fila.appendChild(tdDelete);

        return fila;
    };


    // ─── MOSTRAR LOGIN ───────────────────────────────────────
    const mostrarLogin = () => {
        document.body.style.opacity = '1';
        const panel = document.getElementById('admin-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:center;
                min-height:100vh; padding:20px; margin:-20px;">
                <div style="background:#0d0d1a; border:1px solid #c8973a;
                    padding:40px 30px; width:90%; max-width:320px;
                    text-align:center; font-family:'Segoe UI', sans-serif;">
                    <img src="${CONFIG.ASSETS}${CONFIG.LOGO}" alt="${CONFIG.NOM}"
                        style="height:60px; margin:0 auto 20px auto; display:block;">
                    <p style="color:#c8973a; letter-spacing:2px; text-transform:uppercase;
                        font-size:12px; margin-bottom:20px;">Accés restringit</p>
                    <input id="login-input" type="text" placeholder="Contrasenya"
                        autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                        style="width:100%; padding:10px; background:#0d0d1a; border:1px solid #444;
                        color:#eee; font-size:14px; outline:none; margin-bottom:12px;
                        text-align:center; letter-spacing:2px; -webkit-text-security:disc;">
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
                <button id="btn-nou">＋ Nou plat</button>
                <button id="btn-guardar">💾 Guardar</button>
                <button id="btn-descartar">✕ Descartar</button>
                <span id="admin-comptador"></span>
                <button id="btn-recarregar" style="margin-left:auto;">🔄 Forçar recàrrega</button>
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
                        <th class="col-delete"></th>
                    </tr>
                </thead>
                <tbody id="admin-tbody"></tbody>
            </table>

            <div id="modal-nou-plat">
                <div class="modal-caixa">
                    <h2>Nou plat</h2>
                    <div id="modal-foto-zona">
                        <div class="foto-placeholder"><span>📷</span>SELECCIONAR FOTO</div>
                    </div>
                    <input type="file" id="modal-foto-input" accept="image/*" style="display:none;">
                    <div id="modal-foto-estat"></div>
                    <input type="text"   id="modal-nom"       placeholder="Nom del plat *">
                    <input type="number" id="modal-preu"      placeholder="Preu (0.00)" step="0.01">
                    <select id="modal-categoria">
                        <option value="Plats">Plats</option>
                        <option value="Tapas">Tapas</option>
                        <option value="Postres">Postres</option>
                        <option value="Begudes">Begudes</option>
                    </select>
                    <textarea id="modal-desc" placeholder="Descripció"></textarea>
                    <div class="modal-fila">
                        <input type="checkbox" id="modal-visible" checked
                            style="width:16px; height:16px; accent-color:#c8973a;">
                        <label for="modal-visible"
                            style="color:#aaa; font-size:12px; letter-spacing:1px;">
                            Visible a la web
                        </label>
                    </div>
                    <p id="modal-avis-foto" style="font-size:11px; color:#e74c3c; text-align:center; letter-spacing:1px;">⚠️ Cal pujar una foto per crear el plat</p>
                    <button id="modal-btn-crear" class="modal-boto-crear" disabled>CREAR PLAT</button>
                    <button id="modal-btn-cancel" class="modal-boto-cancel">Cancel·lar</button>
                </div>
            </div>
        `;

        // Events barra
        document.getElementById('btn-nou').addEventListener('click', obrirModalNouPlat);
        document.getElementById('btn-guardar').addEventListener('click', () => {
            if (Object.keys(window.CANVIS_PENDENTS).length > 0) guardarTot();
        });
        document.getElementById('btn-descartar').addEventListener('click', () => {
            if (Object.keys(window.CANVIS_PENDENTS).length > 0) descartarCanvis();
        });

        // Events modal nou plat
        document.getElementById('btn-recarregar').addEventListener('click', async () => {
            const estat = document.getElementById('admin-estat');
            estat.textContent = '⏳ Recarregant...';
            await fetch(`${CONFIG.BASE_WORKER}/reset-kv`, { method: 'POST' });
            location.reload();
        });

        document.getElementById('modal-foto-zona').addEventListener('click', () => {
            document.getElementById('modal-foto-input').click();
        });
        document.getElementById('modal-foto-input').addEventListener('change', (e) => {
            prepararFotoModal(e.target);
        });
        document.getElementById('modal-nom').addEventListener('input', nomInputHandler);
        document.getElementById('modal-btn-crear').addEventListener('click', crearNouPlat);
        document.getElementById('modal-btn-cancel').addEventListener('click', tancarModalNouPlat);

        // Carregar registres
        const res  = await fetch(CONFIG.BASE_WORKER);
        const data = await res.json();
        registres  = data;

        const tbody = document.getElementById('admin-tbody');
        registres.forEach(r => tbody.appendChild(crearFila(r)));

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