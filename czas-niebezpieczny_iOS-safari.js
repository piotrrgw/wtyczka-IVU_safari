// ==UserScript==
// @name         Czas Niebezpieczny (Mobile v2.2)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Lekka nakładka na Safari iOS. Autorzy: Piotr M 🚂 & Gemini
// @author       Piotr M 🚂 & Gemini
// @match        https://irena1.intercity.pl/*
// @grant        none
// ==/UserScript==

/*
 * Wersja aplikacji: v2.2
 * Zmiany: Usunięcie overlay, inteligentny toggle przyciskiem, wyższa pozycja panelu.
 */

(function() {
    'use strict';

    // --- 1. ANALITYKA ---
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-W05T4L1HFD';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-W05T4L1HFD');

    // --- 2. STYLE ---
    const style = document.createElement('style');
    style.innerHTML = `
        #cn-main-btn {
            position: fixed; bottom: 25px; right: 25px; width: 60px; height: 60px;
            background: #007AFF; border-radius: 30px; color: white; font-size: 28px;
            text-align: center; line-height: 60px; cursor: pointer; z-index: 10001;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3); user-select: none; -webkit-tap-highlight-color: transparent;
        }
        #cn-box {
            display: none; position: fixed; top: 20%; left: 5%; width: 90%; max-width: 340px;
            background: rgba(255, 255, 255, 0.98); border-radius: 14px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 10000;
            padding: 16px; font-family: -apple-system, system-ui, sans-serif;
            border: 1px solid #ddd; border-bottom: 4px solid #007AFF;
        }
        #cn-box.open { display: block; }
        .cn-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .cn-t { font-weight: bold; font-size: 17px; }
        .cn-x { font-size: 24px; color: #999; padding: 0 10px; cursor: pointer; }
        .cn-btns { display: flex; gap: 10px; margin-bottom: 15px; }
        .cn-b { flex: 1; padding: 14px; border: none; border-radius: 10px; color: white; font-weight: 600; font-size: 14px; }
        #cn-c { background: #007AFF; }
        #cn-i { background: #34C759; }
        #cn-res { background: #f2f2f7; padding: 12px; border-radius: 8px; font-weight: bold; text-align: center; margin-bottom: 10px; font-size: 14px; border: 1px solid #e5e5ea; }
        #cn-l { max-height: 150px; overflow-y: auto; font-size: 12px; color: #444; }
        .cn-ft { font-size: 9px; color: #888; text-align: center; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; }
    `;
    document.head.appendChild(style);

    // --- 3. DOM ---
    const btn = document.createElement('div');
    btn.id = 'cn-main-btn'; btn.innerHTML = '⏱️';
    document.body.appendChild(btn);

    const box = document.createElement('div');
    box.id = 'cn-box';
    box.innerHTML = `
        <div class="cn-head"><span class="cn-t">Narzędzia Czasu</span><span class="cn-x">×</span></div>
        <div class="cn-btns">
            <button class="cn-b" id="cn-c">Przelicz</button>
            <button class="cn-b" id="cn-i">Wstaw</button>
        </div>
        <div id="cn-res">Suma: -</div>
        <div id="cn-l">Gotowy do pracy.</div>
        <div class="cn-ft">
            Współautorzy: Piotr M 🚂 & Gemini<br>
            Wersja aplikacji: v2.2
        </div>
    `;
    document.body.appendChild(box);

    // --- 4. LOGIKA ---
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

                list.innerHTML += `<div style="margin-bottom:4px"><b>${s}-${e}</b>: ${c}m (${type.trim()})</div>`;
            }
        });
        document.getElementById('cn-res').innerText = `Suma: ${total} min`;
    };

    const ins = () => {
        const comm = document.querySelector("#comment");
        if (!comm) return alert("Błąd: Brak pola komentarza.");
        let v = comm.value.replace(/\n?N:\s*\d+m/g, "").trimEnd();
        comm.value = v ? `${v}\nN: ${total}m` : `N: ${total}m`;
        comm.dispatchEvent(new Event('input', { bubbles: true }));
        document.getElementById('cn-i').innerText = "Wstawiono!";
        setTimeout(() => document.getElementById('cn-i').innerText = "Wstaw", 1500);
    };

    document.getElementById('cn-c').onclick = calc;
    document.getElementById('cn-i').onclick = ins;

})();