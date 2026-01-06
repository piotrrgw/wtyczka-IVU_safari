// ==UserScript==
// @name         Czas Niebezpieczny (Mobile v2.4)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Czytelna nakładka iOS. Bez GTM. Autorzy: Piotr M 🚂, Thundo & Gemini
// @author       Piotr M 🚂, Thundo & Gemini
// @match        https://irena1.intercity.pl/*
// @grant        none
// ==/UserScript==

/*
 * Version: 2.4
 * Updated: 2026-01-06
 * Changes: Fixed readability and authorship.
 */

(function() {
    'use strict';

    // --- 1. STYLE (WCAG & Kontrast) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #cn-main-btn {
            position: fixed; bottom: 30px; right: 25px; width: 66px; height: 66px;
            background: #004494; border-radius: 50%; color: white; font-size: 32px;
            text-align: center; line-height: 66px; cursor: pointer; z-index: 10001;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4); user-select: none;
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
        .cn-x { font-size: 30px; color: #b00; font-weight: bold; cursor: pointer; padding: 5px; }
        
        .cn-btns { display: flex; gap: 15px; margin-bottom: 20px; }
        .cn-b { 
            flex: 1; padding: 18px; border: none; border-radius: 10px; 
            color: white; font-weight: bold; font-size: 16px; text-transform: uppercase;
        }
        #cn-c { background: #004494; }
        #cn-i { background: #1e7e34; }
        
        #cn-res { 
            background: #f0f0f5; padding: 15px; border-radius: 8px; 
            font-weight: 900; text-align: center; margin-bottom: 15px; 
            font-size: 20px; color: #000; border: 1px solid #ccc;
        }
        #cn-l { max-height: 200px; overflow-y: auto; font-size: 15px; color: #111; }
        .cn-item { margin-bottom: 10px; padding: 8px; background: #fff; border: 1px solid #eee; border-radius: 5px; }
        
        .cn-ft { 
            font-size: 12px; color: #444; text-align: center; 
            margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;
        }
    `;
    document.head.appendChild(style);

    // --- 2. BUDOWA INTERFEJSU ---
    const btn = document.createElement('div');
    btn.id = 'cn-main-btn'; btn.innerHTML = '⏱️';
    document.body.appendChild(btn);

    const box = document.createElement('div');
    box.id = 'cn-box';
    box.innerHTML = `
        <div class="cn-head"><span class="cn-t">Czas Niebezpieczny</span><span class="cn-x">×</span></div>
        <div class="cn-btns">
            <button class="cn-b" id="cn-c">Przelicz</button>
            <button class="cn-b" id="cn-i">Wstaw</button>
        </div>
        <div id="cn-res">Suma: -</div>
        <div id="cn-l">Gotowy.</div>
        <div class="cn-ft">
            Autorzy: Piotr M 🚂, <a href="https://github.com/Thundo">Thundo</a> & Gemini<br>
            Wersja aplikacji: v2.4
        </div>
    `;
    document.body.appendChild(box);

    // --- 3. LOGIKA ---
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
            
            if (!/Objęcie|Przekazanie|Próba/.test(type)) return;

            const s = item.querySelector('.actual-duty-time-field-start input')?.value;
            const e = item.querySelector('.actual-duty-time-field-end input')?.value;
            
            if (s && e) {
                const parse = (v) => { const [h,m] = v.split(':').map(Number); return h*60+m; };
                let d = parse(e) - parse(s); if (d < 0) d += 1440;
                
                let c = d;
                if (type.includes("Objęcie")) c = Math.min(d, 20);
                if (type.includes("Przekazanie")) c = Math.min(d, 10);
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