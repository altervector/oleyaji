/* ============================================================
   ADMINLOGIC.JS - Mòdul de modal i edició de productes
   Depèn de: config.js, api.js, galeria.js
   Vistes: client (públic), edició (admin), plat nou (admin)
   ============================================================ */

(function() {

    /*/////////////////////////  1. ESTRUCTURA MODAL  ///////// */

    let socAdmin = CONFIG.ES_ADMIN;
    if (socAdmin) {
        document.body.classList.add('admin-mode-active');
    }

    if (!document.getElementById('modal-detall')) {
        const modalHTML = `
            <div id="modal-detall">
                <span class="tancar-modal" onclick="tancarModal()">&times;</span>
                <div class="modal-contingut" id="contingut-dinamic-modal"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    window.tancarModal = function() {
        document.getElementById('modal-detall').style.display = 'none';
    }

    window.mostrarAvis = function(missatge, tipus = 'ok', recarregar = false) {
        const colorMap = { ok: '#28a745', error: '#dc3545', info: '#191970' };
        const overlay = document.createElement('div');
        overlay.style = `position:fixed; top:0; left:0; width:100%; height:100%; 
            background:rgba(0,0,0,0.5); z-index:99999; 
            display:flex; align-items:center; justify-content:center;`;
        overlay.innerHTML = `
            <div style="background:white; border-radius:12px; padding:30px 40px; 
                max-width:320px; width:90%; text-align:center; 
                box-shadow:0 8px 30px rgba(0,0,0,0.3); font-family:sans-serif;">
                <p style="font-size:16px; color:#333; margin:0 0 20px 0;">${missatge}</p>
                <button id="btn-avis-ok"
                    style="background:${colorMap[tipus]}; color:white; border:none; 
                    padding:10px 30px; border-radius:8px; font-size:15px; 
                    font-weight:bold; cursor:pointer;">OK</button>
            </div>`;
        document.body.appendChild(overlay);
        document.getElementById('btn-avis-ok').onclick = () => {
            overlay.remove();
            if (recarregar) location.reload();
        };
    };


    /*/////////////////////////  2. OBRIR MODAL (CLIENT I ADMIN)  ///////// */

    window.obrirModal = function(idAirtable, foto, esVisible, el) {
        const nom = el.querySelector('.titol-item').innerText;
        const desc = el.querySelector('.desc-text').innerText;
        const preu = el.querySelector('.preu-text').innerText;
        const urlParams = new URLSearchParams(window.location.search);
        const categoriaActual = urlParams.get('Categoria') || '';

        const contingut = document.getElementById('contingut-dinamic-modal');
        const modal = document.getElementById('modal-detall');
        if (!contingut || !modal) return;

        if (CONFIG.ES_ADMIN) {
            // --- VISTA EDICIÓ ---
            modal.style.backgroundColor = "var(--bg-modaledit)";
            contingut.innerHTML = `
                <div style="position:relative;" id="container-foto-admin">
                    <img id="preview-foto" src="${foto}" style="width:100%; height:200px; object-fit:contain; border-radius:10px 10px 0 0; background:#000;">
                    <label id="btn-foto-accion" for="upload-foto" style="position:absolute; bottom:10px; right:10px; background:#191970; color:#fff; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px; font-family:sans-serif;">
                        📷 CANVIAR FOTO
                    </label>
                    <input type="file" id="upload-foto" style="display:none;" accept="image/*" 
                        onchange="window.prepararSubidaFoto(this, '${idAirtable}')">
                </div>
                <div style="padding:20px; text-align:left; display:flex; flex-direction:column; gap:10px;">
                    <input type="text" id="edit-nom" value="${nom}" placeholder="Nom">
                    <textarea id="edit-desc" style="width:100%; height:80px;">${desc}</textarea>
                    <input type="number" id="edit-preu" value="${preu}" step="0.01">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" id="edit-visible" ${esVisible ? 'checked' : ''}>
                        <label>Visible a la web</label>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:5px;">
                        <label style="font-size:12px; color:#666;">Categoria:</label>
                        <select id="edit-categoria" style="padding:8px; border:1px solid #ddd; border-radius:5px;">
                            ${["Begudes", "Tapas", "Plats", "Postres"].map(cat =>
                                `<option value="${cat}" ${cat === categoriaActual ? 'selected' : ''}>${cat}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:10px;">
                        <button onclick="tancarModal()" style="padding:8px 15px; background:#ccc; border:none; border-radius:5px; cursor:pointer;">Cancel·lar</button>
                        <button onclick="guardarCanvis('${idAirtable}')" style="padding:8px 15px; background:#191970; color:#fff; border:none; border-radius:5px; cursor:pointer;">GUARDAR</button>
                    </div>
                </div>`;
        } else {
            // --- VISTA CLIENT (PÚBLICA) ---
            modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            contingut.innerHTML = `
                <img src="${foto}" alt="${nom}" style="width:100%; height:auto; max-height:70vh; object-fit:contain; border-radius:10px 10px 0 0; background:#000;">
                <div style="padding:20px; text-align:left;">
                    <h2 style="margin:0; color:#191970; font-size:22px;">${nom}</h2>
                    <p style="color:#666; margin:15px 0; line-height:1.5; font-size:15px;">${desc}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                        <span style="font-size:22px; font-weight:bold; color:#191970;">${preu} €</span>
                        <button onclick="tancarModal()" style="padding:8px 15px; background:#191970; color:#fff; border:none; border-radius:5px; cursor:pointer;">Tancar</button>
                    </div>
                </div>`;
        }
        modal.style.display = 'flex';
    };


    /*/////////////////////////  3. MODAL PLAT NOU (ADMIN)  ///////// */

    window.obrirModalNuevo = function() {
        const fotoDefault = `${CONFIG.REPO_URL}images/Default.png`;
        const urlParams = new URLSearchParams(window.location.search);
        const categoriaActual = urlParams.get('Categoria') || '';
        const contingut = document.getElementById('contingut-dinamic-modal');
        const modal = document.getElementById('modal-detall');

        if (!contingut || !modal) return;

        modal.style.backgroundColor = "rgba(40, 167, 69, 0.8)";
        contingut.innerHTML = `
            <div style="position:relative;" id="container-foto-admin">
                <img id="preview-foto" src="${fotoDefault}" style="width:100%; height:200px; object-fit:contain; border-radius:10px 10px 0 0; background:#000;">
                <label id="btn-foto-accion" for="upload-foto" style="position:absolute; bottom:10px; right:10px; background:#191970; color:#fff; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px;">
                    📷 SELECCIONAR FOTO
                </label>
                <input type="file" id="upload-foto" style="display:none;" accept="image/*"
                    onchange="window.prepararSubidaFoto(this, null)">
            </div>
            <div style="padding:20px; text-align:left; display:flex; flex-direction:column; gap:10px;">
                <h2 style="margin:0; color:#28a745; font-size:18px;">Nuevo Plato en ${categoriaActual}</h2>
                <input type="text" id="edit-nom" placeholder="Nombre del plato">
                <textarea id="edit-desc" placeholder="Descripción" style="height:70px;"></textarea>
                <input type="number" id="edit-preu" placeholder="Precio (0.00)" step="0.01">
                <input type="hidden" id="nombre-foto-nueva" value="">
                <input type="hidden" id="edit-categoria" value="${categoriaActual}">
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="edit-visible" checked>
                    <label>Visible en la web</label>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <button onclick="tancarModal()" style="padding:10px 15px; background:#ccc; border:none; border-radius:5px;">Cancelar</button>
                    <button id="btn-crear-final" disabled onclick="guardarCanvis(null)" style="padding:10px 15px; background:#888; color:#fff; border:none; border-radius:5px; opacity:0.6;">
                        CREAR PLATO
                    </button>
                </div>
                <p id="aviso-foto" style="font-size:11px; color:#d9534f; margin-top:10px; font-weight:bold;">
                    ⚠️ Primero debes subir la foto para poder crear el plato.
                </p>
            </div>`;
        modal.style.display = 'flex';
    };


    /*/////////////////////////  4. GESTIÓ DE FOTOS (CLOUDINARY)  ///////// */

    window.prepararSubidaFoto = function(input, idAirtable) {
        if (input.files && input.files[0]) {
            const arxiu = input.files[0];
            const nomOriginal = arxiu.name;
            const reader = new FileReader();

            reader.onload = function(e) {
                const preview = document.getElementById('preview-foto');
                const btnAccion = document.getElementById('btn-foto-accion');

                if (preview && btnAccion) {
                    preview.src = e.target.result;
                    btnAccion.innerHTML = "💾 CONFIRMAR I PUJAR FOTO";
                    btnAccion.style.background = "#28a745";
                    btnAccion.removeAttribute('for');

                    btnAccion.onclick = function() {
                        window.executarSubidaFoto(idAirtable, e.target.result, nomOriginal);
                    };

                    if (!document.getElementById('btn-reintentar')) {
                        const btnReintentar = `
                            <label id="btn-reintentar" for="upload-foto"
                                   style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.7); color:#fff; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px;">
                                   🔄 CAMBIAR
                            </label>`;
                        document.getElementById('container-foto-admin').insertAdjacentHTML('beforeend', btnReintentar);
                    }
                }
            };
            reader.readAsDataURL(arxiu);
        }
    };

    window.executarSubidaFoto = async function(idAirtable, base64, nomOriginal) {
        const btnAccion = document.getElementById('btn-foto-accion');
        btnAccion.innerHTML = "⏳ OPTIMITZANT...";
        btnAccion.style.pointerEvents = "none";
        btnAccion.style.background = "#ffc107";

        try {
            const img = new Image();
            img.src = base64;
            await img.decode();

            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_SIZE = 1080;

            if (width > height) {
                if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
            } else {
                if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));

            btnAccion.innerHTML = "🚀 PUJANT...";
            const formData = new FormData();
            formData.append('file', blob, `${Date.now()}.jpg`);
            formData.append('upload_preset', 'ml_default');

            const resCloudy = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDI_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });

            const dataCloudy = await resCloudy.json();

            if (dataCloudy.secure_url) {
                const nomFinal = dataCloudy.public_id + "." + dataCloudy.format;

                // Els dos casos (plat existent i plat nou) fan el mateix:
                // Guarden el nom de la foto i es queden al modal sense recarregar.
                // La foto s'enviarà a Airtable quan es polsi GUARDAR.

                // Guardem el nom al camp ocult (pot ser el de nou o el d'existent)
                let campFoto = document.getElementById('nombre-foto-nueva');
                if (!campFoto) {
                    // Plat existent — creem el camp ocult si no existeix
                    campFoto = document.createElement('input');
                    campFoto.type = 'hidden';
                    campFoto.id = 'nombre-foto-nueva';
                    document.body.appendChild(campFoto);
                }
                campFoto.value = nomFinal;

                // Actualitzem botons i etiqueta
                const btnReintentar = document.getElementById('btn-reintentar');
                if (btnReintentar) btnReintentar.remove();
                btnAccion.innerHTML = "✅ FOTO GUARDADA";
                btnAccion.style.background = "#28a745";
                btnAccion.style.pointerEvents = "none";

                // Habilitem el boto CREAR PLATO si existeix (plat nou)
                const btnFinal = document.getElementById('btn-crear-final');
                if (btnFinal) {
                    btnFinal.disabled = false;
                    btnFinal.style.background = "#28a745";
                    btnFinal.style.cursor = "pointer";
                    btnFinal.style.opacity = "1";
                }

                // Amaguem l'avís de foto obligatòria si existeix (plat nou)
                const avisofoto = document.getElementById('aviso-foto');
                if (avisofoto) avisofoto.style.display = 'none';
            }
        } catch (error) {
            console.error("Error:", error);
            btnAccion.innerHTML = "❌ ERROR";
            btnAccion.style.pointerEvents = "auto";
            btnAccion.style.background = "#dc3545";
            mostrarAvis("❌ Error pujant la imatge.", 'error');
        }
    };


    /*/////////////////////////  5. GUARDAR CANVIS (AIRTABLE)  ///////// */

    window.guardarCanvis = function(idAirtable) {
        const idReal = (idAirtable === "null" || !idAirtable) ? null : idAirtable;

        const dades = {
            id: idReal,
            "Nom": document.getElementById('edit-nom').value.trim(),
            "Descripcio": document.getElementById('edit-desc').value.trim(),
            "Preu": parseFloat(document.getElementById('edit-preu').value.replace(',', '.')) || 0,
            "Visible": document.getElementById('edit-visible').checked,
            "Categoria": [document.getElementById('edit-categoria').value]
        };

        // Tant per a plat nou com per a plat existent, enviem la foto si s'ha canviat
        const campFoto = document.getElementById('nombre-foto-nueva');
        if (campFoto && campFoto.value) dades["Foto"] = campFoto.value;

        if (!dades.Nom) { mostrarAvis("⚠️ El nom és obligatori", 'info'); return; }

        fetch(CONFIG.BASE_WORKER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dades)
        })
        .then(response => {
            if (response.ok) {
                tancarModal();
                mostrarAvis(idReal ? "✅ Guardat correctament!" : "✅ Nou plat creat!", 'ok', true);
            } else {
                mostrarAvis("❌ Error en l'operació.", 'error');
            }
        })
        .catch(error => console.error('Error:', error));
    };

})();