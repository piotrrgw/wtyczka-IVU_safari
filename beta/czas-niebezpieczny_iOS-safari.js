// ==UserScript==
// @name         Czas Niebezpieczny (Mobile v3.3)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Czytelna nakładka z auto-aktualizacją i szybkimi komentarzami. Autorzy: Piotr M 🚂 & Gemini
// @author       Piotr M 🚂 & Gemini
// @match        *://irena1.intercity.pl/*
// @match        *://portal.intercity.pl/mbweb/main/matter/pad/main-menu*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// @downloadURL  https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// ==/UserScript==

/*
 * Wersja aplikacji: v3.3
 * Updated: 2026-03-11
 * Changes: Dodano kreator wprowadzania opóźnień pociągów z dynamicznym formatowaniem tekstu.
 * Współautorzy: Piotr M 🚂 & Gemini
 */

(function() {
    'use strict';

    // Zabezpieczenie przed uruchamianiem w ukrytych ramkach (zapobiega dublowaniu przycisku)
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
            // Zabezpieczenie przed podwójnym dodaniem
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
    
    // Adres do pliku z komentarzami na GitHubie
    const COMMENTS_JSON_URL = 'https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/komentarze.json';

    // --- 2. STYLE (WCAG/EAA) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #cn-box { display: none; position: fixed; top: 10%; left: 5%; width: 90%; max-width: 380px; max-height: 85vh; overflow-y: auto; background: #ffffff; border-radius: 12px; border: 3px solid #004494; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10000; padding: 20px; font-family: sans-serif; }
        #cn-box.open { display: block; }
        .cn-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #004494; padding-bottom: 10px; }
        .cn-t { font-weight: bold; font-size: 20px; color: #000; }
        .cn-x { font-size: 35px; color: #b00; cursor: pointer; padding: 5px; }
        .cn-btns { display: flex; gap: 10px; margin-bottom: 15px; }
        .cn-b { flex: 1; padding: 15px; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; text-transform: uppercase; }
        #cn-c { background: #004494; }
        #cn-i { background: #1e7e34; }
        #cn-res { background: #f0f0f5; padding: 15px; border-radius: 8px; font-weight: bold; text-align: center; font-size: 22px; border: 1px solid #ccc; margin-bottom: 10px; color: #000; }
        
        /* Nowe style dla podwójnych przycisków i formularza */
        .cn-btn-outline { flex: 1; padding: 10px; border: 2px solid #004494; background: #fff; color: #004494; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; transition: 0.2s; text-align: center; }
        .cn-btn-outline:hover, .cn-btn-outline[aria-expanded="true"] { background: #f0f8ff; }
        
        #cn-comments-container { display: none; flex-wrap: wrap; gap: 8px; margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 8px; border: 1px dashed #ccc; }
        .cn-pill { background: #e2e8f0; color: #0f172a; padding: 8px 12px; border-radius: 20px; font-size: 13px; border: 1px solid #cbd5e1; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .cn-pill:active { background: #cbd5e1; }
        
        #cn-delay-container { display: none; flex-direction: column; gap: 8px; margin-bottom: 15px; padding: 12px; background: #f4f6f8; border-radius: 8px; border: 1px solid #cdd4db; }
        .cn-input { width: 100%; padding: 10px; border: 1px solid #aaa; border-radius: 6px; box-sizing: border-box; font-size: 14px; font-family: sans-serif; }
        .cn-input:focus { outline: 2px solid #004494; border-color: transparent; }
        #cn-btn-add-delay { background: #004494; color: white; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 5px; }
        
        #cn-l { max-height: 200px; overflow-y: auto; font-size: 14px; color: #333; }
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
        
        <div class="cn-btns" style="margin-bottom: 10px;">
            <button id="cn-btn-comments" class="cn-btn-outline" aria-expanded="false">💬 Komentarze</button>
            <button id="cn-btn-delay" class="cn-btn-outline" aria-expanded="false">🚆 Opóźnienie</button>
        </div>
        
        <div id="cn-comments-container" aria-live="polite"></div>
        
        <div id="cn-delay-container" aria-live="polite">
            <input type="number" id="cn-del-nr" placeholder="Nr pociągu (wymagane)" aria-label="Numer pociągu" class="cn-input">
            <input type="text" id="cn-del-st" placeholder="Stacja (opcjonalnie)" aria-label="Nazwa stacji" class="cn-input">
            <input type="text" id="cn-del-rs" placeholder="Przyczyna (np. Awaria SRK)" aria-label="Przyczyna opóźnienia" class="cn-input">
            <input type="number" id="cn-del-tm" placeholder="Czas [min] (opcjonalnie)" aria-label="Czas opóźnienia w minutach" class="cn-input">
            <button id="cn-btn-add-delay">Wstaw do komentarza</button>
        </div>

        <div id="cn-l">Gotowy do pracy...</div>
        <div class="cn-ft">
            Współautorzy: Piotr M 🚂 & Gemini<br>
            Wersja aplikacji: v3.3
        </div>
    `;
    document.body.appendChild(box);

    // --- 4. LOGIKA ---
    function toggleBoxOpen() {
        box.classList.toggle('open');
    }
    
    box.querySelector('.cn-x').onclick = () => box.classList.remove('open');

    let totalMinutes = 0;
    let commentsLoaded = false;

    const parseTime = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    const calculate = () => {
        const items = document.querySelectorAll(".component-info.list-item");
        const listContainer = document.getElementById('cn-l');
        listContainer.innerHTML = "";
        totalMinutes = 0;

        items.forEach(item => {
            const input = item.querySelector('.actual-duty-component-type input');
            const label = item.querySelector('.actual-duty-component-type .changed-label');
            
            const id = input?.getAttribute('data-val');
            const currentName = label ? label.textContent.trim() : (input ? input.value : "");
            
            let rule = COMPONENT_RULES[id];
            if (!rule) {
                const foundKey = Object.keys(COMPONENT_RULES).find(key => currentName.includes(COMPONENT_RULES[key].name));
                if (foundKey) rule = COMPONENT_RULES[foundKey];
            }

            if (!rule) return;

            const start = item.querySelector('.actual-duty-time-field-start input')?.value;
            const end = item.querySelector('.actual-duty-time-field-end input')?.value;
            
            if (start && end) {
                let duration = parseTime(end) - parseTime(start);
                if (duration < 0) duration += 1440; 
                
                const counted = rule.limit ? Math.min(duration, rule.limit) : duration;
                totalMinutes += counted;

                listContainer.innerHTML += `
                    <div class="cn-item">
                        <b>${start} - ${end}</b>: ${counted} min<br>
                        <small>${rule.name}</small>
                    </div>`;
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

    // --- LOGIKA WSTAWIANIA TEKSTU ---
    const insertCommentText = (newText) => {
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

    // --- OBSŁUGA JSON ---
    const loadComments = async () => {
        const container = document.getElementById('cn-comments-container');
        container.innerHTML = 'Ładowanie...';
        
        try {
            const response = await fetch(COMMENTS_JSON_URL + '?t=' + new Date().getTime());
            if (!response.ok) throw new Error('Brak pliku');
            
            const data = await response.json();
            container.innerHTML = '';
            
            data.forEach(item => {
                const pill = document.createElement('button');
                pill.className = 'cn-pill';
                pill.innerText = item.etykieta;
                pill.setAttribute('aria-label', `Wstaw komentarz: ${item.etykieta}`);
                pill.onclick = () => insertCommentText(item.tekst);
                container.appendChild(pill);
            });
        } catch (error) {
            container.innerHTML = '<span style="color:red; font-size: 12px;">Błąd pobierania bazy z GitHub.</span>';
        }
    };

    // --- PRZEŁĄCZANIE ZAKŁADEK (AKORDEON) ---
    const btnComments = document.getElementById('cn-btn-comments');
    const btnDelay = document.getElementById('cn-btn-delay');
    const contComments = document.getElementById('cn-comments-container');
    const contDelay = document.getElementById('cn-delay-container');

    btnComments.onclick = function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        contComments.style.display = !isExpanded ? 'flex' : 'none';
        
        if (!isExpanded && !commentsLoaded) {
            loadComments();
            commentsLoaded = true;
        }
        
        // Ukryj drugi formularz
        btnDelay.setAttribute('aria-expanded', 'false');
        contDelay.style.display = 'none';
    };

    btnDelay.onclick = function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        contDelay.style.display = !isExpanded ? 'flex' : 'none';
        
        // Ukryj drugi formularz
        btnComments.setAttribute('aria-expanded', 'false');
        contComments.style.display = 'none';
    };

    // --- OBSŁUGA FORMULARZA OPÓŹNIEŃ ---
    document.getElementById('cn-btn-add-delay').onclick = function() {
        const nr = document.getElementById('cn-del-nr').value.trim();
        const st = document.getElementById('cn-del-st').value.trim();
        const rs = document.getElementById('cn-del-rs').value.trim();
        const tm = document.getElementById('cn-del-tm').value.trim();

        if (!nr) {
            alert('Wpisz przynajmniej numer pociągu!');
            return;
        }

        let delayText = `*${nr}`;
        if (st) delayText += ` < ${st}>`;
        if (rs) delayText += ` ${rs}`;
        if (tm) delayText += ` +${tm} min`;

        insertCommentText(delayText);

        // Wyczyszczenie pól po wstawieniu
        document.getElementById('cn-del-nr').value = '';
        document.getElementById('cn-del-st').value = '';
        document.getElementById('cn-del-rs').value = '';
        document.getElementById('cn-del-tm').value = '';
    };

    document.getElementById('cn-c').onclick = calculate;
    document.getElementById('cn-i').onclick = insertTime;
})();