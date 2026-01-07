// ==UserScript==
// @name         Czas Niebezpieczny (Mobile v2.8.1)
// @namespace    http://tampermonkey.net/
// @version      2.8.1
// @description  Czytelna nakładka iOS z auto-aktualizacją. Autorzy: Piotr M 🚂, Thundo & Gemini
// @author       Piotr M 🚂, Thundo & Gemini
// @match        https://irena1.intercity.pl/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// @downloadURL  https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// ==/UserScript==

/*
 * Version: 2.8.1
 * Updated: 2026-01-07
 * Changes: Dodano obsługę "DK Prace Manewrowe KP".
 */

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        #cn-main-btn { position: fixed; bottom: 30px; right: 25px; width: 66px; height: 66px; background: #004494; border-radius: 50%; color: white; font-size: 32px; text-align: center; line-height: 66px; cursor: pointer; z-index: 10001; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 2px solid #fff; }
        #cn-box { display: none; position: fixed; top: 10%; left: 5%; width: 90%; max-width: 380px; background: #ffffff; border-radius: 12px; border: 3px solid #004494; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10000; padding: 20px; font-family: sans-serif; }
        #cn-box.open { display: block; }
        .cn-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #004494; padding-bottom: 10px; }
        .cn-t { font-weight: bold; font-size: 20px; color: #000; }
        .cn-x { font-size: 35px; color: #b00; cursor: pointer; padding: 5px; }
        .cn-btns { display: flex; gap: 10px; margin-bottom: 15px; }
        .cn-b { flex: 1; padding: 15px; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; }
        #cn-c { background: #004494; }
        #cn-i { background: #1e7e34; }
        #cn-res { background: #f0f0f5; padding: 15px; border-radius: 8px; font-weight: bold; text-align: center; font-size: 22px; border: 1px solid #ccc; margin-bottom: 10px; }
        #cn-l { max-height: 200px; overflow-y: auto; font-size: 14px; }
        .cn-item { margin-bottom: 8px; padding: 8px; background: #fff; border: 1px solid #ddd; border-radius: 6px; }
        .cn-ft { font-size: 11px; color: #555; text-align: center; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; }
        .cn-ft a { color: #004494; text-decoration: none; }
    `;
    document.head.appendChild(style);

    const box = document.createElement('div');
    box.id = 'cn-box';
    box.innerHTML = `
        <div class="cn-head"><span class="cn-t">Kalkulator CN</span><span class="cn-x">×</span></div>
        <div class="cn-btns"><button class="cn-b" id="cn-c">Przelicz</button><button class="cn-b" id="cn-i">Wstaw</button></div>
        <div id="cn-res">Suma: -</div>
        <div id="cn-l">Pobierz dane z karty...</div>
        <div class="cn-ft">
            Autorzy: <a href="https://github.com/piotrrgw">Piotr M 🚂</a>, <a href="https://github.com/Thundo54">Thundo</a> & Gemini<br>
            Wersja aplikacji: v2.7
        </div>
    `;
    document.body.appendChild(box);

    const btn = document.createElement('div');
    btn.id = 'cn-main-btn'; btn.innerHTML = '⏱️';
    document.body.appendChild(btn);

    btn.onclick = () => box.classList.toggle('open');
    box.querySelector('.cn-x').onclick = () => box.classList.remove('open');

    let total = 0;

    const calc = () => {
        const items = document.querySelectorAll(".component-info.list-item");
        const list = document.getElementById('cn-l');
        list.innerHTML = ""; total = 0;

        items.forEach(item => {
            const typeInp = item.querySelector('.actual-duty-component-type input');
            const changedLabel = item.querySelector('.actual-duty-component-type .changed-label');
            
            // Pobieramy tekst z etykiety (widocznej dla użytkownika) lub z inputa
            let typeText = changedLabel ? changedLabel.textContent.trim() : (typeInp ? typeInp.value : "");
            
            // Dodatkowe sprawdzenie po kodzie data-val (11243 to Prace Manewrowe KP)
            const dataVal = typeInp ? typeInp.getAttribute('data-val') : "";
            if (dataVal === "11243") typeText = "DK Prace Manewrowe KP";

            if (!/Objęcie|Przekazanie|Próba|Manewrowe/.test(typeText)) return;

            const s = item.querySelector('.actual-duty-time-field-start input')?.value;
            const e = item.querySelector('.actual-duty-time-field-end input')?.value;
            
            if (s && e) {
                const p = (v) => { const [h,m] = v.split(':').map(Number); return h*60+m; };
                let d = p(e) - p(s); if (d < 0) d += 1440;
                
                let c = d;
                if (typeText.includes("Objęcie")) c = Math.min(d, 20);
                else if (typeText.includes("Przekazanie")) c = Math.min(d, 10);
                
                total += c;
                list.innerHTML += `<div class="cn-item"><b>${s}-${e}</b>: ${c} min<br><small>${typeText}</small></div>`;
            }
        });
        document.getElementById('cn-res').innerText = `Suma: ${total} min`;
    };

    const ins = () => {
        const comm = document.querySelector("#comment");
        if (!comm) return alert("Nie znaleziono pola komentarza!");
        let v = comm.value.replace(/\n?N:\s*\d+m/g, "").trimEnd();
        comm.value = v ? `${v}\nN: ${total}m` : `N: ${total}m`;
        comm.dispatchEvent(new Event('input', { bubbles: true }));
        alert("Wstawiono sumę do komentarza.");
    };

    document.getElementById('cn-c').onclick = calc;
    document.getElementById('cn-i').onclick = ins;
})();