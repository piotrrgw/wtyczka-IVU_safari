// ==UserScript==
// @name         Czas Niebezpieczny (Mobile v3.14.1)
// @namespace    http://tampermonkey.net/
// @version      3.14.1
// @description  Czytelna nakładka z auto-aktualizacją. Poprawka widoczności tekstu w formularzach (wymuszony czarny kolor). Autorzy: Piotr M 🚂 & Gemini
// @author       Piotr M 🚂 & Gemini
// @match        *://irena1.intercity.pl/*
// @match        *://portal.intercity.pl/mbweb/main/matter/pad/main-menu*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// @downloadURL  https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// ==/UserScript==

/*
 * Wersja aplikacji: v3.14.1
 * Updated: 2026-04-24
 * Changes: Wymuszenie czarnego koloru tekstu w polach input/select formularza, aby uniknąć białego tekstu na białym tle (konflikt z dark mode/CSS portalu).
 * Współautorzy: Piotr M 🚂 & Gemini
 */

(function() {
    'use strict';

    if (window.top !== window.self) return;

    const CURRENT_VERSION = 3.14;
    const SCRIPT_URL = 'https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js';

    // --- BLOKADA POBIERANIA PLIKU 'logout' ---
    const blockLogoutDownload = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'IFRAME' && node.src && node.src.toLowerCase().includes('logout')) {
                    node.remove();
                    console.log('Czas Niebezpieczny: Zablokowano pobieranie pliku logout (iframe).');
                }
                if (node.tagName === 'A' && node.href && node.href.toLowerCase().includes('logout') && node.hasAttribute('download')) {
                    node.remove();
                    console.log('Czas Niebezpieczny: Zablokowano pobieranie pliku logout (a download).');
                }
            });
        });
    });
    
    blockLogoutDownload.observe(document.documentElement, { childList: true, subtree: true });

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
        "11243": { name: "DK Prace Manewrowe KP", limit: null },
        "11243": { name: "DK Kierownik manewrów", limit: null }
    };
    
    const REASONS_JSON_URL = 'https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/przyczyny.json';

    // --- 2. STYLE (WCAG/EAA) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #cn-box { display: none; position: fixed; top: 5%; left: 5%; width: 90%; max-width: 400px; max-height: 90vh; overflow-y: auto; background: #ffffff; border-radius: 12px; border: 3px solid #004494; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10000; padding: 20px; font-family: sans-serif; box-sizing: border-box; }
        #cn-box.open { display: block; }
        .cn-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #004494; padding-bottom: 10px; }
        .cn-t { font-weight: bold; font-size: 20px; color: #000; }
        .cn-x { font-size: 35px; color: #b00; cursor: pointer; padding: 5px; line-height: 1; }
        
        /* Główne przyciski */
        .cn-b { width: 100%; padding: 15px; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 14px; margin-bottom: 15px; }
        #cn-c { background: #004494; }
        #cn-btn-insert-all { background: #1e7e34; margin-bottom: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        #cn-btn-insert-all:active { transform: scale(0.98); }
        
        /* Boksy statystyk */
        .cn-stat-box { padding: 10px; border-radius: 8px; font-weight: bold; text-align: center; border: 1px solid; }
        #cn-res-n { background: #f0f0f5; border-color: #ccc; color: #000; font-size: 20px; margin-bottom: 10px; }
        .cn-stat-row { display: flex; gap: 10px; margin-bottom: 15px; }
        #cn-res-work { flex: 1; background: #e6f2ff; border-color: #b3d9ff; color: #004494; font-size: 14px; }
        #cn-res-break { flex: 1; background: #e6ffe6; border-color: #b3ffb3; color: #1e7e34; font-size: 14px; }
        
        #cn-update-notice { background: #f59e0b; color: #fff; padding: 10px; text-align: center; font-size: 14px; font-weight: bold; border-radius: 6px; margin-bottom: 15px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 8px; }
        #cn-update-notice:hover { background: #d97706; }

        /* Formularz opóźnień */
        .cn-btn-outline { width: 100%; padding: 12px; border: 2px solid #004494; background: #fff; color: #004494; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 15px; text-align: center; transition: 0.2s; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .cn-btn-outline:hover, .cn-btn-outline[aria-expanded="true"] { background: #f0f8ff; }
        
        #cn-delay-container { display: none; flex-direction: column; gap: 12px; margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .cn-label { display: block; font-size: 12px; color: #475569; font-weight: bold; margin-bottom: 4px; }
        
        /* Wymuszony ciemny kolor tekstu dla pól input i select, aby uniknąć problemu białego tekstu na białym tle */
        .cn-input, .cn-select { width: 100%; padding: 12px; border: 1px solid #94a3b8; border-radius: 6px; box-sizing: border-box; font-size: 16px; font-family: sans-serif; background-color: #fff !important; color: #000 !important; }
        
        .cn-select { appearance: auto; -webkit-appearance: auto; height: 45px; }
        .cn-input:focus, .cn-select:focus { outline: 2px solid #004494; border-color: transparent; }
        #cn-del-preview { background: #eef2f6; border: 1px dashed #94a3b8; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 14px; color: #334155; min-height: 20px; word-break: break-word; }
        
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
        
        <button class="cn-b" id="cn-c">Przelicz Wykaz</button>
        
        <div id="cn-res-n" class="cn-stat-box" aria-live="polite">Czas Niebezpieczny: -</div>
        <div class="cn-stat-row" aria-live="polite">
            <div id="cn-res-work" class="cn-stat-box" title="Czas od rozpoczęcia pierwszej do zakończenia ostatniej czynności">Czas pracy: -</div>
            <div id="cn-res-break" class="cn-stat-box" title="Łączny czas wszystkich przerw">Przerwa: -</div>
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
        </div>

        <button id="cn-btn-insert-all" class="cn-b">WSTAW KOMENTARZ</button>

        <div id="cn-l">Gotowy do pracy...</div>
        <div class="cn-ft">
            Współautorzy: Piotr M 🚂 & Gemini<br>
            Wersja aplikacji: v3.14
        </div>
    `;
    document.body.appendChild(box);

    // --- 4. LOGIKA ---
    let totalMinutes = 0;
    let totalBreakMinutes = 0;
    let totalWorkMinutes = 0;
    let reasonsLoaded = false;
    let checkedForUpdate = false;

    const checkForUpdates = async () => {
        try {
            const response = await fetch(SCRIPT_URL + '?t=' + new Date().getTime());
            if (!response.ok) return;
            const text = await response.text();
            const versionMatch = text.match(/@version\s+([0-9.]+)/);
            if (versionMatch && versionMatch[1]) {
                const remoteVersion = parseFloat(versionMatch[1]);
                if (remoteVersion > CURRENT_VERSION) {
                    const head = document.querySelector('.cn-head');
                    if (head && !document.getElementById('cn-update-notice')) {
                        const notice = document.createElement('div');
                        notice.id = 'cn-update-notice';
                        notice.innerHTML = `<span class="material-icons" style="font-size: 18px;">system_update</span> Dostępna aktualizacja (v${remoteVersion})! Kliknij tutaj.`;
                        notice.onclick = () => window.open(SCRIPT_URL, '_blank');
                        head.insertAdjacentElement('afterend', notice);
                    }
                }
            }
        } catch (error) {
            console.error("Błąd sprawdzania aktualizacji:", error);
        }
    };

    function toggleBoxOpen() {
        box.classList.toggle('open');
        if (!checkedForUpdate) { checkForUpdates(); checkedForUpdate = true; }
    }
    
    box.querySelector('.cn-x').onclick = () => box.classList.remove('open');

    const parseTime = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    // --- BEZBŁĘDNA DETEKCJA CZASU OPARTA NA DANYCH OD UŻYTKOWNIKA ---
    const getActualTime = (container) => {
        if (!container) return null;
        
        const timeInput = container.querySelector('input[type="time"].actual-duty-time-field-input, input[type="time"]');
        if (timeInput && timeInput.value) return timeInput.value;

        const textInput = container.querySelector('input.actual-duty-time-field-input:not([type="hidden"])');
        if (textInput && textInput.value) {
            const match = textInput.value.match(/\d{1,2}:\d{2}/);
            if (match) return match[0];
        }
        
        const changedLabel = container.querySelector('.changed-label');
        if (changedLabel && changedLabel.textContent) {
            const match = changedLabel.textContent.match(/\d{1,2}:\d{2}/);
            if (match) return match[0];
        }

        return null;
    };

    const calculate = () => {
        const items = document.querySelectorAll(".component-info.list-item");
        const listContainer = document.getElementById('cn-l');
        listContainer.innerHTML = "";
        
        totalMinutes = 0;
        totalBreakMinutes = 0;
        totalWorkMinutes = 0;

        let firstStartTime = null;
        let currentShiftEnd = null;

        items.forEach(item => {
            const inputType = item.querySelector('.actual-duty-component-type input');
            const labelType = item.querySelector('.actual-duty-component-type .changed-label');
            const id = inputType?.getAttribute('data-val');
            const currentName = labelType ? labelType.textContent.trim() : (inputType ? inputType.value : "");
            
            const startContainer = item.querySelector('.actual-duty-time-field-start');
            const endContainer = item.querySelector('.actual-duty-time-field-end');
            
            const startStr = getActualTime(startContainer);
            const endStr = getActualTime(endContainer);
            
            if (startStr && endStr) {
                const s = parseTime(startStr);
                let e = parseTime(endStr);
                let duration = e - s;
                if (duration < 0) {
                    duration += 1440; // Przejście przez północ
                    e += 1440;
                }

                // Kalkulacja łącznego czasu trwania zmiany
                if (firstStartTime === null) {
                    firstStartTime = s;
                    currentShiftEnd = s + duration;
                } else {
                    let adjustedStart = s;
                    while (adjustedStart < currentShiftEnd - 1440) {
                        adjustedStart += 1440;
                    }
                    if (adjustedStart < firstStartTime) adjustedStart += 1440;
                    
                    let adjustedEnd = adjustedStart + duration;
                    if (adjustedEnd > currentShiftEnd) {
                        currentShiftEnd = adjustedEnd;
                    }
                }

                // Kalkulacja przerw (sprawdzanie słowa kluczowego)
                if (currentName.toLowerCase().includes('przerwa')) {
                    totalBreakMinutes += duration;
                }

                // Kalkulacja Czasu Niebezpiecznego
                let rule = COMPONENT_RULES[id];
                if (!rule) {
                    const foundKey = Object.keys(COMPONENT_RULES).find(key => currentName.includes(COMPONENT_RULES[key].name));
                    if (foundKey) rule = COMPONENT_RULES[foundKey];
                }

                if (rule) {
                    const counted = rule.limit ? Math.min(duration, rule.limit) : duration;
                    totalMinutes += counted;
                    listContainer.innerHTML += `<div class="cn-item"><b>${startStr} - ${endStr}</b>: ${counted} min<br><small>${rule.name}</small></div>`;
                }
            }
        });

        if (firstStartTime !== null && currentShiftEnd !== null) {
            totalWorkMinutes = currentShiftEnd - firstStartTime;
        }

        const formatHM = (mins) => {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            return `${h}:${m.toString().padStart(2, '0')}`;
        };

        document.getElementById('cn-res-n').innerText = `Czas Niebezp.: ${totalMinutes} min`;
        document.getElementById('cn-res-work').innerText = `Czas pracy: ${formatHM(totalWorkMinutes)}`;
        document.getElementById('cn-res-break').innerText = `Przerwa: ${totalBreakMinutes} min`;
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

    // --- JEDEN WSPÓLNY PRZYCISK: WSTAW KOMENTARZ ---
    document.getElementById('cn-btn-insert-all').onclick = function() {
        // Wymuszamy najpierw przeliczenie czasów, by mieć pewność, że N: jest aktualne
        calculate();

        const delayTxt = updatePreview();
        const isDelayFormOpen = document.getElementById('cn-delay-container').style.display === 'flex';
        const nr = document.getElementById('cn-del-nr').value.trim();

        // Jeżeli użytkownik otworzył formularz i coś w nim wpisał, ale zapomniał numeru pociągu:
        if (isDelayFormOpen && !nr && (document.getElementById('cn-del-st').value.trim() || selectReason.value || document.getElementById('cn-del-tm').value.trim())) {
            alert('Wypełniasz formularz opóźnienia – wpisz przynajmniej numer pociągu!');
            document.getElementById('cn-del-nr').focus();
            return;
        }

        const commentArea = document.querySelector("#comment");
        if (!commentArea) return alert("Nie znaleziono pola komentarza w systemie!");

        let currentText = commentArea.value;

        // Wycinamy stare wpisy N: aby uniknąć duplikatów
        let textWithoutN = currentText.replace(/N:\s*\d+m/g, "").trim();

        // Dodajemy wygenerowane opóźnienie (jeśli zostało wpisane i nie ma go już w komentarzu)
        if (delayTxt && !textWithoutN.includes(delayTxt)) {
            textWithoutN = textWithoutN ? `${textWithoutN}\n${delayTxt}` : delayTxt;
        }

        // Doklejamy aktualne N: XXm zawsze na samym początku pierwszej linii
        const finalN = `N: ${totalMinutes}m`;
        commentArea.value = textWithoutN ? `${finalN}\n${textWithoutN}` : finalN;

        commentArea.dispatchEvent(new Event('input', { bubbles: true }));

        // Czyszczenie formularza opóźnienia (tylko jeśli był faktycznie wypełniony)
        if (delayTxt) {
            document.getElementById('cn-del-nr').value = '';
            document.getElementById('cn-del-st').value = '';
            selectReason.value = '';
            customReasonInput.value = '';
            customReasonCont.style.display = 'none';
            document.getElementById('cn-del-tm').value = '';
            updatePreview();
            
            // Zwiń panel po udanym wstawieniu
            if (btnDelay.getAttribute('aria-expanded') === 'true') {
                btnDelay.click();
            }
        }

        alert("Komentarz systemowy pomyślnie zaktualizowany!");
    };

    // Podpięcie ręcznego przycisku Przelicz
    document.getElementById('cn-c').onclick = calculate;
})();