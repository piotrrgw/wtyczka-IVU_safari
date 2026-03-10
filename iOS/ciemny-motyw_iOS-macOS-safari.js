// ==UserScript==
// @name         IVU.plan Dark Mode
// @namespace    https://github.com/quoid/userscripts
// @version      1.4
// @description  Ciemny motyw dla Irena i Portal Intercity. Autorzy: Piotr M 🚂, Thundo & Gemini.
// @match        *://irena1.intercity.pl/*
// @match        *://portal.intercity.pl/*
// @require      https://cdn.jsdelivr.net/npm/darkreader@4.9.120/darkreader.min.js
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/ciemny-motyw_iOS-macOS-safari.js
// @downloadURL  https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/ciemny-motyw_iOS-macOS-safari.js
// ==/UserScript==

/*
 * Wersja aplikacji: v1.4
 * Updated: 2026-03-10
 * Changes: Naprawa błędu podwójnego przycisku (blokada iframe i weryfikacja DOM).
 * Autorzy: Piotr M 🚂, Thundo & Gemini
 */

(function() {
    'use strict';

    // 1. Zabezpieczenie: Skrypt uruchamia się tylko w głównym oknie, ignoruje iframes
    if (window.top !== window.self) return;

    const savedState = localStorage.getItem('userscripts-darkmode-state') || 'false';
    let isDarkMode = (savedState === 'true');

    if (isDarkMode) {
        DarkReader.enable({
            brightness: 100,
            contrast: 100,
            sepia: 0
        });
    }

    function toggleDarkMode() {
        if (isDarkMode) {
            DarkReader.disable();
            isDarkMode = false;
            localStorage.setItem('userscripts-darkmode-state', 'false'); 
        } else {
            DarkReader.enable({
                brightness: 100,
                contrast: 90,
                sepia: 10
            });
            isDarkMode = true;
            localStorage.setItem('userscripts-darkmode-state', 'true'); 
        }
    }

    // Zgodność z WCAG i EAA: dodano role, aria-label, title (zastępuje stopkę)
    const buttonHTML = `
        <a id="userscripts-darkmode-button" class="ivupad-action-button ivupad-action-button--round" role="button" aria-label="Przełącz ciemny motyw" title="Wersja aplikacji: v1.4 | Autorzy: Piotr M 🚂 & Gemini" style="cursor: pointer;">
            <span><i class="material-icons" aria-hidden="true">brightness_6</i></span>
        </a>`;

    const checkExist = setInterval(function() {
        const targetElement = document.querySelector('#ivupad-button-main-user'); 

        if (targetElement) {
            clearInterval(checkExist);
            
            // 2. Zabezpieczenie: Sprawdzamy, czy nasz przycisk już nie istnieje przed jego dodaniem
            if (!document.getElementById('userscripts-darkmode-button')) {
                targetElement.insertAdjacentHTML('afterend', buttonHTML);
                document.getElementById('userscripts-darkmode-button').addEventListener('click', toggleDarkMode);
            }
        }
    }, 500);

})();