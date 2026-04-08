// ==UserScript==
// @name         Czas Niebezpieczny (Mobile BETA v3.6)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Czytelna nakładka z auto-aktualizacją, kreatorem opóźnień i inteligentną detekcją edytowanych czasów. Autorzy: Piotr M 🚂 & Gemini
// @author       Piotr M 🚂 & Gemini
// @match        *://irena1.intercity.pl/*
// @match        *://portal.intercity.pl/mbweb/main/matter/pad/main-menu*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/BETA/beta/B_czas-niebezpieczny_iOS-safari.js
// @downloadURL  https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/BETA/beta/B_czas-niebezpieczny_iOS-safari.js
// ==/UserScript==

/*
 * Wersja aplikacji: v3.6
 * Updated: 2026-03-12
 * Changes: Wersja BETA. Naprawiono przeliczanie z edytowanych czasów (priorytet changed-label przed oryginalnym input). Brak GTM.
 * Współautorzy: Piotr M 🚂 & Gemini
 */

(function() {
    'use strict';

    if (window.top !== window.self) return;

    // --- PRZYCISK W GÓRNYM PASKU ---
    const buttonHTML = `
        <a id="userscripts-cn-button" class="ivupad-action-button ivupad-action-button--round" role="button" aria-label="Otwórz Czas Niebezpieczny" style="cursor: pointer;">
            <span><i class="material-icons" aria-hidden="true">timelapse</i></span>
        </a>`;

    const checkExist = setInterval(function() {
        const targetElement = document.querySelector('#ivupad-button-main-user'); 

        if (targetElement) {
            clearInterval(checkExist);
            if (!document.getElementById('userscripts-cn-button')) {
                targetElement.insertAdjacentHTML('afterend', buttonHTML);
                document.getElementById('userscripts-cn-button').addEventListener('click', toggleBoxOpen);
            }
        }
    }, 500);

    // --- 1. KONFIGURACJA I MAPOWANIE ---
    const COMPONENT_RULES = {
        "11239": { name: "DK Objęcie pociągu", limit: 20 },
        "11240": { name: "DK Przekazanie pociągu", limit: 10 },
        "11245": { name: "DK Próba hamulca", limit: null },
        "11243": { name: "DK Prace Manewrowe KP", limit: null }
    };
    
    // Adresy do plików JSON w środowisku BETA
    const COMMENTS_JSON_URL = 'https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/BETA/beta/komentarze.json';
    const REASONS_JSON_URL = 'https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/BETA/beta/przyczyny.json';

    // --- 2. STYLE (WCAG/EAA) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #cn-box { display: none; position: fixed; top: 5%; left: 5%; width: 90%; max-width: 400px; max-height: 90vh; overflow-y: auto; background: #ffffff; border-radius: 12px; border: 3px solid #004494; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10000; padding: 20px; font-family: sans-serif; box-sizing: border-box; }
        #cn-box.open { display: block; }
        .cn-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #004494; padding-bottom: 10px; }
        .cn-t { font-weight: bold; font-size: 20px; color: #000; }
        .cn-x { font-size: 35px; color: #b00; cursor: pointer; padding: 5px; line-height: 1; }
        .cn-btns { display: flex; gap: 10px; margin-bottom: 15px; }
        .cn-b { flex: 1; padding: 15px; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 14px; }
        #cn-c { background: #004494; }
        #cn-i { background: #1e7e34; }
        #cn-res { background: #f0f0f5; padding: 15px; border-radius: 8px; font-weight: bold; text-align: center; font-size: 22px; border: 1px solid #ccc; margin-bottom: 15px; color: #000; }
        
        /* Pigułki i Szybkie Uwagi */
        .cn-section-title { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        #cn-comments-container { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px; }
        .cn-pill { background: #e2e8f0; color: #0f172a; padding: 10px 15px; border-radius: 20px; font-size: 14px; border: 1px solid #cbd5e1; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: background 0.2s; }
        .cn-pill:active { background: #cbd5e1; }
        
        /* Przycisk kreatora i Formularz */
        .cn-btn-outline { width: 100%; padding: 12px; border: 2px solid #004494; background: #fff; color: #004494; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 15px; text-align: center; transition: 0.2s; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .cn-btn-outline:hover, .cn-btn-outline[aria-expanded="true"] { background: #f0f8ff; }
        
        #cn-delay-container { display: none; flex-direction: column; gap: 12px; margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .cn-label { display: block; font-size: 12px; color: #475569; font-weight: bold; margin-bottom: 4px; }
        .cn-input, .cn-select { width: 100%; padding: 12px; border: 1px solid #94a3b8; border-radius: 6px; box-sizing: border-box; font-size: 16px; font-family: sans-serif; background-color: #fff; }
        .cn-select { appearance: auto; -webkit-appearance: auto; height: 45px; }
        .cn-input:focus, .cn-select:focus { outline: 2px solid #004494; border-color: transparent; }
        #cn-del-preview { background: #eef2f6; border: 1px dashed #94a3b8; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 14px; color: #334155; min-height: 20px; word-break: break-word; }
        #cn-btn-add-delay { background: #0f766e; color: white; padding: 14px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px; margin-top: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        
        #cn-l { max-height: 150px; overflow-y: auto; font-size: 14px; color: #333; margin-top: 10px; }
        .cn-item { margin-bottom: 8px; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 6px; border-left: 5px solid #004494; }
        .cn-ft { font-size: 11px; color: #555; text-align: center; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; line-height: 1.4; }
    `;
    document.head.appendChild(style);

    // --- 3. INTERFEJS ---
    const box = document.createElement('div');
    box.id = 'cn-box';
    box.innerHTML = `
        <div class="cn-head"><span class="cn-t">Czas Niebezpieczny</span><span class="cn-x" role="button" aria-label="Zamknij">×</span></div>
        <div class="cn-btns"><button class="cn-b" id="cn-c">Przelicz</button><button class="cn-b" id="cn-i">Wstaw Czas</button></div>
        <div id="cn-res" aria-live="polite">Suma: -</div>
        
        <div class="cn-section-title">Szybkie uwagi</div>
        <div id="cn-comments-container" aria-live="polite">
            <span style="font-size:12px; color:#666;">Ładowanie z bazy...</span>
        </div>
        
        <button id="cn-btn-delay" class="cn-btn-outline" aria-expanded="false">
            <span style="font-size:18px;">🚆</span> Zgłoś opóźnienie pociągu
        </button>
        
        <div id="cn-delay-container" aria-live="polite">
            <div>
                <label class="cn-label" for="cn-del-nr">Numer pociągu <span style="color:#e11d48;">*</span></label>
                <input type="number" id="cn-del-nr" placeholder="np. 18114" class="cn-input">
            </div>
            
            <div>
                <label class="cn-label" for="cn-del-st">Stacja (opcjonalnie)</label>
                <input type="text" id="cn-del-st" placeholder="np. Łódź Fabryczna" class="cn-input">
            </div>
            
            <div>
                <label class="cn-label" for="cn-del-rs">Przyczyna</label>
                <select id="cn-del-rs" class="cn-select">
                    <option value="">-- Wybierz z listy --</option>
                </select>
            </div>

            <div id="cn-del-custom-container" style="display: none;">
                <label class="cn-label" for="cn-del-rs-custom">Wpisz własną przyczynę</label>
                <input type="text" id="cn-del-rs-custom" placeholder="np. Uderzenie w drzewo" class="cn-input">
            </div>
            
            <div>
                <label class="cn-label" for="cn-del-tm">Czas opóźnienia [min] (opcjonalnie)</label>
                <input type="number" id="cn-del-tm" placeholder="np. 20" class="cn-input">
            </div>
            
            <div id="cn-del-preview">Podgląd: (wypełnij formularz)</div>
            
            <button id="cn-btn-add-delay">Wstaw do komentarza</button>
        </div>

        <div id="cn-l">Gotowy do pracy...</div>
        <div class="cn-ft">
            Współautorzy: Piotr M 🚂 & Gemini<br>
            Wersja aplikacji: v3.6
        </div>
    `;
    document.body.appendChild(box);

    // --- 4. LOGIKA ---
    function toggleBoxOpen() {
        box.classList.toggle('open');
        if (!commentsLoaded) { loadComments(); commentsLoaded = true; }
    }
    
    box.querySelector('.cn-x').onclick = () => box.classList.remove('open');

    let totalMinutes = 0;
    let commentsLoaded = false;
    let reasonsLoaded = false;

    const parseTime = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    // Inteligentne pobieranie edytowanego czasu
    const getActualTime = (container) => {
        if (!container) return null;
        
        // 1. Sprawdzamy, czy system wstrzyknął zmienioną etykietę 'changed-label'
        const changedLabel = container.querySelector('.changed-label');
        if (changedLabel && changedLabel.textContent.trim()) {
            const timeMatch = changedLabel.textContent.match(/\d{1,2}:\d{2}/);
            if (timeMatch) return timeMatch[0];
        }
        
        // 2. Fallback - bierzemy standardowe widoczne pole input (bierzemy ostatnie dostępne w przypadku duplikatów systemu)
        const inputs = Array.from(container.querySelectorAll('input')).filter(i => i.type !== 'hidden');
        if (inputs.length > 0) {
            return inputs[inputs.length - 1].value;
        }
        
        return null;
    };

    const calculate = () => {
        const items = document.querySelectorAll(".component-info.list-item");
        const listContainer = document.getElementById('cn-l');
        listContainer.innerHTML = "";
        totalMinutes = 0;

        items.forEach(item => {
            const inputType = item.querySelector('.actual-duty-component-type input');
            const labelType = item.querySelector('.actual-duty-component-type .changed-label');
            const id = inputType?.getAttribute('data-val');
            const currentName = labelType ? labelType.textContent.trim() : (inputType ? inputType.value : "");
            
            let rule = COMPONENT_RULES[id];
            if (!rule) {
                const foundKey = Object.keys(COMPONENT_RULES).find(key => currentName.includes(COMPONENT_RULES[key].name));
                if (foundKey) rule = COMPONENT_RULES[foundKey];
            }

            if (!rule) return;

            const startContainer = item.querySelector('.actual-duty-time-field-start');
            const endContainer = item.querySelector('.actual-duty-time-field-end');
            
            const start = getActualTime(startContainer);
            const end = getActualTime(endContainer);
            
            if (start && end) {
                let duration = parseTime(end) - parseTime(start);
                if (duration < 0) duration += 1440; 
                const counted = rule.limit ? Math.min(duration, rule.limit) : duration;
                totalMinutes += counted;
                listContainer.innerHTML += `<div class="cn-item"><b>${start} - ${end}</b>: ${counted} min<br><small>${rule.name}</small></div>`;
            }
        });

        document.getElementById('cn-res').innerText = `Suma: ${totalMinutes} min`;
    };

    const insertTime = () => {
        const commentArea = document.querySelector("#comment");
        if (!commentArea) return alert("Nie znaleziono pola komentarza!");
        let currentText = commentArea.value.replace(/\n?N:\s*\d+m/g, "").trimEnd();
        commentArea.value = currentText ? `${currentText}\nN: ${totalMinutes}m` : `N: ${totalMinutes}m`;
        commentArea.dispatchEvent(new Event('input', { bubbles: true }));
        alert("Suma minut wstawiona pomyślnie.");
    };

    const insertCommentText = (newText) => {
        if(!newText) return;
        const commentArea = document.querySelector("#comment");
        if (!commentArea) return alert("Nie znaleziono pola komentarza!");
        
        let currentText = commentArea.value;
        if (currentText.includes(newText)) return;
        
        const nMatch = currentText.match(/\n?N:\s*\d+m/);
        if (nMatch) {
            currentText = currentText.replace(nMatch[0], `\n${newText}${nMatch[0]}`);
        } else {
            currentText = currentText ? `${currentText}\n${newText}` : newText;
        }
        
        commentArea.value = currentText.trim();
        commentArea.dispatchEvent(new Event('input', { bubbles: true }));
    };

    // --- POBIERANIE JSON ---
    const loadComments = async () => {
        const container = document.getElementById('cn-comments-container');
        try {
            const response = await fetch(COMMENTS_JSON_URL + '?t=' + new Date().getTime());
            if (!response.ok) throw new Error('Brak pliku');
            const data = await response.json();
            container.innerHTML = '';
            data.forEach(item => {
                const pill = document.createElement('button');
                pill.className = 'cn-pill';
                pill.innerText = item.etykieta;
                pill.onclick = () => insertCommentText(item.tekst);
                container.appendChild(pill);
            });
        } catch (error) {
            container.innerHTML = '<span style="color:red; font-size: 12px;">Błąd pobierania bazy uwag.</span>';
        }
    };

    const loadReasons = async () => {
        const select = document.getElementById('cn-del-rs');
        try {
            const response = await fetch(REASONS_JSON_URL + '?t=' + new Date().getTime());
            if (!response.ok) return;
            const data = await response.json();
            data.forEach(reason => {
                const opt = document.createElement('option');
                opt.value = reason;
                opt.innerText = reason;
                select.appendChild(opt);
            });
            const customOpt = document.createElement('option');
            customOpt.value = "CUSTOM";
            customOpt.innerText = "➕ Inna (wpisz ręcznie)...";
            select.appendChild(customOpt);
        } catch (error) {}
    };

    // --- LOGIKA KREATORA OPÓŹNIEŃ ---
    const btnDelay = document.getElementById('cn-btn-delay');
    const contDelay = document.getElementById('cn-delay-container');
    const selectReason = document.getElementById('cn-del-rs');
    const customReasonCont = document.getElementById('cn-del-custom-container');
    const customReasonInput = document.getElementById('cn-del-rs-custom');

    btnDelay.onclick = function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        contDelay.style.display = !isExpanded ? 'flex' : 'none';
        
        if (!isExpanded && !reasonsLoaded) {
            loadReasons();
            reasonsLoaded = true;
        }
    };

    selectReason.addEventListener('change', (e) => {
        if (e.target.value === "CUSTOM") {
            customReasonCont.style.display = 'block';
            customReasonInput.focus();
        } else {
            customReasonCont.style.display = 'none';
            customReasonInput.value = '';
        }
        updatePreview();
    });

    const updatePreview = () => {
        const nr = document.getElementById('cn-del-nr').value.trim();
        const st = document.getElementById('cn-del-st').value.trim();
        let rs = selectReason.value;
        if (rs === 'CUSTOM') rs = customReasonInput.value.trim();
        const tm = document.getElementById('cn-del-tm').value.trim();

        let txt = '';
        if (nr) txt += `*${nr}`;
        if (st) txt += ` < ${st}>`;
        if (rs) txt += ` ${rs}`;
        if (tm) txt += ` +${tm} min`;

        document.getElementById('cn-del-preview').innerText = txt ? `Podgląd: ${txt}` : 'Podgląd: (wypełnij formularz)';
        return txt;
    };

    document.getElementById('cn-del-nr').addEventListener('input', updatePreview);
    document.getElementById('cn-del-st').addEventListener('input', updatePreview);
    customReasonInput.addEventListener('input', updatePreview);
    document.getElementById('cn-del-tm').addEventListener('input', updatePreview);

    document.getElementById('cn-btn-add-delay').onclick = function() {
        const txt = updatePreview();
        const nr = document.getElementById('cn-del-nr').value.trim();

        if (!nr) {
            alert('Wpisz przynajmniej numer pociągu (wymagane).');
            document.getElementById('cn-del-nr').focus();
            return;
        }

        insertCommentText(txt);

        document.getElementById('cn-del-nr').value = '';
        document.getElementById('cn-del-st').value = '';
        selectReason.value = '';
        customReasonInput.value = '';
        customReasonCont.style.display = 'none';
        document.getElementById('cn-del-tm').value = '';
        updatePreview();
        
        btnDelay.click();
    };

    document.getElementById('cn-c').onclick = calculate;
    document.getElementById('cn-i').onclick = insertTime;
})();