// ==UserScript==
// @name         Czas Niebezpieczny (Mobile v2.5)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Czytelna nakładka iOS z auto-aktualizacją. Autorzy: Piotr M 🚂, Thundo & Gemini
// @author       Piotr M 🚂, Thundo & Gemini
// @match        https://irena1.intercity.pl/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// @downloadURL  https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js
// ==/UserScript==

/*
 * Version: 2.6
 * Updated: 2026-01-07
 * Changes: Dodano obsługę "DK Prace Manewrowe KP".
 */

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        #cn-main-btn {
            position: fixed; bottom: 30px; right: 25px; width: 66px; height: 66px;
            background: #004494; border-radius: 50%; color: white; font-size: 32px;
            text-align: center; line-height: 66px; cursor: pointer; z-index: 10001;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4); user-select: none; border: 2px solid #fff;
        }
        #cn-box {
            display: none; position: fixed; top: 10%; left: 5%; width: 90%; max-width: 380px;
            background: #ffffff; border-radius: 12px; border: 3px solid #004494;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10000;
            padding: 20px; font-family: -apple-system, system-ui, sans-serif;
        }
        #cn-box.open { display: block; }
        .cn-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #004494; padding-bottom: 10px; }
        .cn-t { font-weight: bold; font-size: 20px; color: #000; }
        .cn-x { font-size: 35px; color: #b00; font-weight: bold; cursor: pointer; padding: 5px; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; }
        .cn-btns { display: flex; gap: 15px; margin-bottom: 20px; }
        .cn-b { flex: 1; padding: 18px; border: none; border-radius: 10px; color: white; font-weight: bold; font-size: 16px; text-transform: uppercase; min-height: 55px; cursor: pointer; }
        #cn-c { background: #004494; }
        #cn-i { background: #1e7e34; }
        #cn-res { background: #f0f0f5; padding: 15px; border-radius: 8px; font-weight: 900; text-align: center; margin-bottom: 15px; font-size: 20px; color: #000; border: 1px solid #ccc; }
        #cn-l { max-height: 250px; overflow-y: auto; font-size: 15px; color: #111; }
        .cn-item { margin-bottom: 10px; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 8px; }
        .cn-ft { font-size: 11px; color: #444; text-align: center; margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px; line-height: 1.4; }
        .cn-ft a { color: #004494; text-decoration: none; }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('div');
    btn.id = 'cn-main-btn'; btn.innerHTML = '⏱️';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'Otwórz kalkulator');
    document.body.appendChild(btn);

    const box = document.createElement('div');
    box.id = 'cn-box';
    box.innerHTML = `
        <div class="cn-head"><span class="cn-t">Czas Niebezpieczny</span><span class="cn-x" role="button" aria-label="Zamknij">×</span></div>
        <div class="cn-btns">
            <button class="cn-b" id="cn-c">Przelicz</button>
            <button class="cn-b" id="cn-i">Wstaw</button>
        </div>
        <div id="cn-res" aria-live="polite">Suma: -</div>
        <div id="cn-l">Kliknij Przelicz, aby pobrać dane.</div>
        <div class="cn-ft">
            Autorzy: <a href="https://github.com/piotrrgw">Piotr M 🚂</a>, <a href="https://github.com/Thundo54">Thundo</a> & Gemini<br>
            Wersja aplikacji: v2.6
        </div>
    `;
    document.body.appendChild(box);

    const toggle = () => box.classList.toggle('open');
    btn.onclick = toggle;
    box.querySelector('.cn-x').onclick = toggle;

    let total = 0;

    const calc = () => {
        const items = document.querySelectorAll(".component-info.list-item");
        const list = document.getElementById('cn-l');
        list.innerHTML = ""; total = 0;

        items.forEach(item => {
            let type = "";
            const inp = item.querySelector('.actual-duty-component-type input');
            const lab = item.querySelector('.actual-duty-component-type label.changed-label');
            type = (inp && inp.value) ? inp.value : (lab ? lab.textContent : "");
            
            if (!/Objęcie|Przekazanie|Próba|Prace Manewrowe/.test(type)) return;

            const s = item.querySelector('.actual-duty-time-field-start input')?.value;
            const e = item.querySelector('.actual-duty-time-field-end input')?.value;
            
            if (s && e) {
                const parse = (v) => { const [h,m] = v.split(':').map(Number); return h*60+m; };
                let d = parse(e) - parse(s); if (d < 0) d += 1440;
                
                let c = d;
                if (type.includes("Objęcie")) c = Math.min(d, 20);
                else if (type.includes("Przekazanie")) c = Math.min(d, 10);
                
                total += c;
                list.innerHTML += `<div class="cn-item"><b>${s}-${e}</b>: ${c} min<br><small>${type.trim()}</small></div>`;
            }
        });
        document.getElementById('cn-res').innerText = `Suma: ${total} min`;
    };

    const ins = () => {
        const comm = document.querySelector("#comment");
        if (!comm) return alert("Brak pola komentarza.");
        let v = comm.value.replace(/\n?N:\s*\d+m/g, "").trimEnd();
        comm.value = v ? `${v}\nN: ${total}m` : `N: ${total}m`;
        comm.dispatchEvent(new Event('input', { bubbles: true }));
        document.getElementById('cn-i').innerText = "WSTAWIONO!";
        setTimeout(() => document.getElementById('cn-i').innerText = "Wstaw", 1200);
    };

    document.getElementById('cn-c').onclick = calc;
    document.getElementById('cn-i').onclick = ins;
})();