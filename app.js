/**
 * app.js - Lógica Frontend Portal de Denuncias SINFUSAS TailAdmin
 * Conexión directa a Supabase con iconos SVG nativos acordes a cada motivo
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Selector Anónimo vs Identificado
    const btnAnonimo = document.getElementById('btn-anonimo');
    const btnIdentificado = document.getElementById('btn-identificado');
    const panelDatos = document.getElementById('panel-datos-personales');
    const anonBadge = document.getElementById('anon-badge');
    const inputDenunciante = document.getElementById('denunciante');

    let esAnonimo = true;

    if (btnAnonimo && btnIdentificado) {
        btnAnonimo.addEventListener('click', () => {
            esAnonimo = true;
            btnAnonimo.className = 'py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-white dark:bg-boxdark text-primary shadow-default';
            btnIdentificado.className = 'py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all text-body dark:text-bodydark hover:text-black dark:hover:text-white';
            if (panelDatos) panelDatos.classList.add('hidden');
            if (inputDenunciante) inputDenunciante.value = '';
            if (anonBadge) {
                anonBadge.innerHTML = `
                    <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Recomendado</span>
                `;
                anonBadge.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1';
                anonBadge.style.cssText = 'background-color:rgba(18,183,106,0.1);color:#12b76a;border:1px solid rgba(18,183,106,0.2)';
            }
        });

        btnIdentificado.addEventListener('click', () => {
            esAnonimo = false;
            btnIdentificado.className = 'py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-white dark:bg-boxdark text-primary shadow-default';
            btnAnonimo.className = 'py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all text-body dark:text-bodydark hover:text-black dark:hover:text-white';
            if (panelDatos) panelDatos.classList.remove('hidden');
            if (anonBadge) {
                anonBadge.innerHTML = `
                    <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>Protegido</span>
                `;
                anonBadge.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1';
                anonBadge.style.cssText = 'background-color:rgba(70,95,255,0.1);color:#465fff;border:1px solid rgba(70,95,255,0.2)';
            }
            if (inputDenunciante) inputDenunciante.focus();
        });
    }

    // 2. Contador de caracteres en descripción
    const txtDesc = document.getElementById('descripcion');
    const charCount = document.getElementById('char-count');
    if (txtDesc && charCount) {
        txtDesc.addEventListener('input', () => {
            charCount.textContent = `${txtDesc.value.length} / 2000`;
        });
    }

    // 3. Cargar tipos de denuncia dinámicos con formato de tarjetas TailAdmin e iconos SVG acordes
    const tipoCardsContainer = document.getElementById('tipo-cards-container');
    const inputTipoId = document.getElementById('tipo_id');
    if (tipoCardsContainer && inputTipoId) {
        await loadTipoCards(tipoCardsContainer, inputTipoId);
    }

    // 4. Manejo del formulario de Denuncia Ciudadana
    const denunciaForm = document.getElementById('denunciaForm');
    if (denunciaForm) {
        denunciaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;

            const tipoIdVal = inputTipoId ? inputTipoId.value : '';
            if (!tipoIdVal) {
                alert('Por favor selecciona un tipo de incidente.');
                return;
            }
            
            submitBtn.innerHTML = `
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                </svg>
                <span>Registrando denuncia...</span>
            `;
            submitBtn.disabled = true;

            const formData = new FormData(denunciaForm);
            const denuncianteVal = esAnonimo ? 'Anónimo' : (inputDenunciante?.value.trim() || 'Anónimo');

            // Generar código aleatorio de 6 dígitos único para seguridad del ciudadano
            const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

            const payload = {
                titulo: formData.get('titulo')?.trim(),
                tipo_id: parseInt(tipoIdVal, 10),
                descripcion: formData.get('descripcion')?.trim(),
                denunciante: denuncianteVal,
                estado_id: 1, // Recibida / Inicial por defecto
                codigo: randomCode
            };

            try {
                // Insertar en Supabase
                const { data, error } = await window.supabaseClient
                    .from('denuncias')
                    .insert([payload])
                    .select('id, codigo')
                    .single();
                
                if (error) throw error;
                
                // Redirigir al comprobante con el código de 6 dígitos generado
                const finalCode = data.codigo || randomCode;
                window.location.href = `codigo.html?codigo=${finalCode}&id=${data.id}`;

            } catch (error) {
                console.error('Error insertando en Supabase:', error);
                alert(`Error al registrar la denuncia: ${error.message || 'Verifica la conexión a la base de datos o permisos RLS.'}`);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Generador de Iconos SVG Nativos acordes a cada motivo específico de denuncia
function getTipoSvg(nombre) {
    if (window.getTipoSvg && window.getTipoSvg !== getTipoSvg) {
        return window.getTipoSvg(nombre);
    }
    const n = (nombre || '')
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // 1. Acoso Laboral, Hostigamiento, Violencia de Género
    if (n.includes('acoso') || n.includes('violencia') || n.includes('hostigamiento')) {
      return `<svg width="20" height="20" class="w-5 h-5 svg-icon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>`;
    }

    // 2. Corrupción, Cohecho, Malversación, Sobornos, Ética
    if (n.includes('corrupcion') || n.includes('cohecho') || n.includes('malversacion') || n.includes('soborno') || n.includes('etica')) {
      return `<svg width="20" height="20" class="w-5 h-5 svg-icon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`;
    }

    // 3. Fraude, Cobros no autorizados, Desvíos, Estafas
    if (n.includes('fraude') || n.includes('desvio') || n.includes('estafa') || n.includes('cobro')) {
      return `<svg width="20" height="20" class="w-5 h-5 svg-icon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }

    // 4. Mal Servicio, Deficiente atención, Negligencia
    if (n.includes('servicio') || n.includes('atencion') || n.includes('negligencia') || n.includes('mal')) {
      return `<svg width="20" height="20" class="w-5 h-5 svg-icon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    }

    // 5. Infraestructura, Edilicia, Condiciones de Trabajo Físicas
    if (n.includes('infraestructura') || n.includes('urbana') || n.includes('vial') || n.includes('edilicia') || n.includes('mantenimiento')) {
      return `<svg width="20" height="20" class="w-5 h-5 svg-icon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`;
    }

    // 6. Abuso de Autoridad, Desvío de Poder, Sanciones Arbitrarias
    if (n.includes('abuso') || n.includes('autoridad') || n.includes('arbitrariedad') || n.includes('jerarquia')) {
      return `<svg width="20" height="20" class="w-5 h-5 svg-icon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m14.5 12.5-8 8a2.119 2.119 0 0 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></svg>`;
    }

    // 7. Salud Ocupacional, Riesgo Sanitario, Seguridad e Higiene
    if (n.includes('salud') || n.includes('ambiente') || n.includes('higiene') || n.includes('sanidad') || n.includes('accidente')) {
      return `<svg width="20" height="20" class="w-5 h-5 svg-icon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 11l6.92.5L12 19"/></svg>`;
    }

    // 8. Asuntos Sindicales, Libertad Gremial, Salarios
    if (n.includes('sindical') || n.includes('gremial') || n.includes('laboral') || n.includes('salario') || n.includes('persecucion')) {
      return `<svg width="20" height="20" class="w-5 h-5 svg-icon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    }

    // 9. General, Otro, Asuntos Varios
    return `<svg width="20" height="20" class="w-5 h-5 svg-icon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h5"/></svg>`;
}

// Cargar tipos de denuncia y renderizar tarjetas interactivas TailAdmin
async function loadTipoCards(container, hiddenInput) {
    try {
        const { data, error } = await window.supabaseClient
            .from('tipos_denuncia')
            .select('id, nombre, descripcion')
            .order('id', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            container.innerHTML = '';
            
            data.forEach((tipo, index) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.dataset.id = tipo.id;
                
                const isSelected = (index === 0);
                if (isSelected) {
                    hiddenInput.value = tipo.id;
                    btn.className = 'tipo-card w-full flex items-center p-3.5 rounded-xl border-2 border-primary text-black dark:text-white transition-all text-left shadow-default';
                    btn.style.cssText = 'background:rgba(70,95,255,0.06)';
                } else {
                    btn.className = 'tipo-card w-full flex items-center p-3.5 rounded-xl bg-white dark:bg-boxdark border border-stroke dark:border-strokedark text-black dark:text-white hover:border-primary transition-all text-left';
                    btn.style.cssText = '';
                }

                const svgIcon = getTipoSvg(tipo.nombre);
                // Unique accent color per card
                const cardColors = ['#465fff','#8b5cf6','#06b6d4','#ea580c','#12b76a','#f79009','#e11d48','#0891b2'];
                const accent = cardColors[index % cardColors.length];

                btn.innerHTML = `
                    <div class="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center mr-3.5 transition-colors" style="${isSelected ? `background:${accent};color:white;` : `background:${accent}15;color:${accent};`}">
                        ${svgIcon}
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="font-bold text-xs truncate text-black dark:text-white">${tipo.nombre}</div>
                        <div class="text-[11px] text-body dark:text-bodydark truncate">${tipo.descripcion || 'Incidencia de reporte gremial'}</div>
                    </div>
                    <span class="check-icon ${isSelected ? '' : 'hidden'} ml-2 flex-shrink-0" style="color:#465fff;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                    </span>
                `;

                btn.addEventListener('click', () => {
                    // Desmarcar todas
                    container.querySelectorAll('.tipo-card').forEach((c, ci) => {
                        c.className = 'tipo-card w-full flex items-center p-3.5 rounded-xl bg-white dark:bg-boxdark border border-stroke dark:border-strokedark text-black dark:text-white hover:border-primary transition-all text-left';
                        c.style.cssText = '';
                        const cIconDiv = c.querySelector('div');
                        const cAccent = cardColors[ci % cardColors.length];
                        if (cIconDiv) { cIconDiv.className = 'h-10 w-10 shrink-0 rounded-xl flex items-center justify-center mr-3.5 transition-colors'; cIconDiv.style.cssText = `background:${cAccent}15;color:${cAccent}`; }
                        const cCheck = c.querySelector('.check-icon');
                        if (cCheck) cCheck.classList.add('hidden');
                    });

                    // Marcar actual
                    hiddenInput.value = tipo.id;
                    btn.className = 'tipo-card w-full flex items-center p-3.5 rounded-xl border-2 border-primary text-black dark:text-white transition-all text-left shadow-default';
                    btn.style.cssText = 'background:rgba(70,95,255,0.06)';
                    const iconDiv = btn.querySelector('div');
                    if (iconDiv) { iconDiv.className = 'h-10 w-10 shrink-0 rounded-xl flex items-center justify-center mr-3.5 transition-colors'; iconDiv.style.cssText = `background:${accent};color:white`; }
                    const check = btn.querySelector('.check-icon');
                    if (check) check.classList.remove('hidden');
                });

                container.appendChild(btn);
            });
        } else {
            container.innerHTML = '<div class="p-3 text-xs text-body dark:text-bodydark">No hay tipos de denuncia configurados.</div>';
        }
    } catch (err) {
        console.error('Error cargando tipos:', err);
        container.innerHTML = '<div class="p-3 text-xs text-danger">Error al cargar categorías de denuncia.</div>';
    }
}
