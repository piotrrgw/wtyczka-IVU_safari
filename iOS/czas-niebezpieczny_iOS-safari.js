// ==UserScript==
// @name         Czas Niebezpieczny (Mobile v2.8.3)
// @namespace    http://tampermonkey.net/
// @version      2.8.3
// @description  Czytelna nakładka iOS z auto-aktualizacją. Autorzy: Piotr M 🚂, Thundo & Gemini
// @author       Piotr M 🚂, Thundo & Gemini
// @match        https://irena1.intercity.pl/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// @downloadURL  https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// ==/UserScript==

/*
 * Version: 2.8.3
 * Updated: 2026-01-07
 * Changes: Dodano obsługę "DK Prace Manewrowe KP".
 */

(function() {
    'use strict';

    // --- 1. KONFIGURACJA I MAPOWANIE ---
    const COMPONENT_RULES = {
        "11239": { name: "DK Objęcie pociągu", limit: 20 },
        "11240": { name: "DK Przekazanie pociągu", limit: 10 },
        "11245": { name: "DK Próba hamulca", limit: null },
        "11243": { name: "DK Prace Manewrowe KP", limit: null }
    };

    // --- 2. STYLE (WCAG/EAA) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #cn-main-btn { position: fixed; bottom: 30px; right: 25px; width: 66px; height: 66px; background: #004494; border-radius: 50%; color: white; font-size: 32px; text-align: center; line-height: 66px; cursor: pointer; z-index: 10001; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 2px solid #fff; }
        #cn-box { display: none; position: fixed; top: 10%; left: 5%; width: 90%; max-width: 380px; background: #ffffff; border-radius: 12px; border: 3px solid #004494; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10000; padding: 20px; font-family: sans-serif; }
        #cn-box.open { display: block; }
        .cn-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #004494; padding-bottom: 10px; }
        .cn-t { font-weight: bold; font-size: 20px; color: #000; }
        .cn-x { font-size: 35px; color: #b00; cursor: pointer; padding: 5px; }
        .cn-btns { display: flex; gap: 10px; margin-bottom: 15px; }
        .cn-b { flex: 1; padding: 15px; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; text-transform: uppercase; }
        #cn-c { background: #004494; }
        #cn-i { background: #1e7e34; }
        #cn-res { background: #f0f0f5; padding: 15px; border-radius: 8px; font-weight: bold; text-align: center; font-size: 22px; border: 1px solid #ccc; margin-bottom: 10px; color: #000; }
        #cn-l { max-height: 250px; overflow-y: auto; font-size: 14px; color: #333; }
        .cn-item { margin-bottom: 8px; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 6px; border-left: 5px solid #004494; }
        .cn-ft { font-size: 11px; color: #555; text-align: center; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; line-height: 1.4; }
        .cn-ft a { color: #004494; text-decoration: none; font-weight: bold; }
    `;
    document.head.appendChild(style);

    // --- 3. INTERFEJS ---
    const box = document.createElement('div');
    box.id = 'cn-box';
    box.innerHTML = `
        <div class="cn-head"><span class="cn-t">Kalkulator CN</span><span class="cn-x">×</span></div>
        <div class="cn-btns"><button class="cn-b" id="cn-c">Przelicz</button><button class="cn-b" id="cn-i">Wstaw</button></div>
        <div id="cn-res" aria-live="polite">Suma: -</div>
        <div id="cn-l">Gotowy do pracy...</div>
        <div class="cn-ft">
            Autorzy: <a href="https://github.com/piotrrgw">Piotr M 🚂</a>, <a href="https://github.com/Thundo54">Thundo</a> & Gemini<br>
            Wersja aplikacji: v2.8
        </div>
    `;
    document.body.appendChild(box);

    const btn = document.createElement('div');
    btn.id = 'cn-main-btn'; btn.innerHTML = '⏱️';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'Otwórz kalkulator');
    document.body.appendChild(btn);

    // --- 4. LOGIKA ---
    btn.onclick = () => box.classList.toggle('open');
    box.querySelector('.cn-x').onclick = () => box.classList.remove('open');

    let totalMinutes = 0;

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
            
            // Rozpoznawanie typu
            const id = input?.getAttribute('data-val');
            const currentName = label ? label.textContent.trim() : (input ? input.value : "");
            
            // Sprawdzenie reguł (po ID lub po nazwie)
            let rule = COMPONENT_RULES[id];
            if (!rule) {
                // Szukanie reguły po fragmencie nazwy, jeśli ID nie pasuje
                const foundKey = Object.keys(COMPONENT_RULES).find(key => currentName.includes(COMPONENT_RULES[key].name));
                if (foundKey) rule = COMPONENT_RULES[foundKey];
            }

            if (!rule) return;

            const start = item.querySelector('.actual-duty-time-field-start input')?.value;
            const end = item.querySelector('.actual-duty-time-field-end input')?.value;
            
            if (start && end) {
                let duration = parseTime(end) - parseTime(start);
                if (duration < 0) duration += 1440; // Obsługa przejścia przez północ
                
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

    const insert = () => {
        const commentArea = document.querySelector("#comment");
        if (!commentArea) return alert("Nie znaleziono pola komentarza!");
        
        let currentText = commentArea.value.replace(/\n?N:\s*\d+m/g, "").trimEnd();
        commentArea.value = currentText ? `${currentText}\nN: ${totalMinutes}m` : `N: ${totalMinutes}m`;
        
        commentArea.dispatchEvent(new Event('input', { bubbles: true }));
        alert("Suma została wstawiona.");
    };

    document.getElementById('cn-c').onclick = calculate;
    document.getElementById('cn-i').onclick = insert;
})();