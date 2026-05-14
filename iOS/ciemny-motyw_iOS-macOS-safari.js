// ==UserScript==
// @name         IVU.plan Dark Mode & Clear Cache
// @namespace    https://github.com/quoid/userscripts
// @version      1.5
// @description  Ciemny motyw dla Irena i Portal Intercity oraz czyszczenie pamięci (bez przeładowania).
// @match        *://irena1.intercity.pl/*
// @match        *://portal.intercity.pl/*
// @require      https://cdn.jsdelivr.net/npm/darkreader@4.9.120/darkreader.min.js
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/ciemny-motyw_iOS-macOS-safari.js
// @downloadURL  https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/ciemny-motyw_iOS-macOS-safari.js
// ==/UserScript==

/*
 * Wersja aplikacji: v1.5
 * Updated: 2026-05-14
 * Changes: Usunięcie automatycznego przeładowania strony po czyszczeniu pamięci.
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

    function clearIvuMemory() {
        const userConfirmed = window.confirm("Rozpoczynasz proces czyszczenia pamięci podręcznej IVU. Czy chcesz kontynuować?");
        if (userConfirmed) {
            localStorage.clear();
            sessionStorage.clear();
            // Automatyczne przeładowanie zostało usunięte zgodnie z Twoją prośbą.
        }
    }

    // Zgodność z WCAG i EAA: dedykowane aria-label oraz responsywne marginesy
    const darkModeButtonHTML = `
        <a id="userscripts-darkmode-button" class="ivupad-action-button ivupad-action-button--round" role="button" aria-label="Przełącz ciemny motyw" title="Przełącz ciemny motyw" style="cursor: pointer; margin-right: 8px;">
            <span><i class="material-icons" aria-hidden="true">brightness_6</i></span>
        </a>`;

    const clearMemoryButtonHTML = `
        <a id="userscripts-clearmemory-button" class="ivupad-action-button ivupad-action-button--round" role="button" aria-label="Wyczyść pamięć podręczną" title="Wyczyść pamięć" style="cursor: pointer;">
            <span><i class="material-icons" aria-hidden="true">delete</i></span>
        </a>`;

    const checkExist = setInterval(function() {
        const targetElement = document.querySelector('#ivupad-button-main-user'); 

        if (targetElement) {
            clearInterval(checkExist);
            
            if (!document.getElementById('userscripts-darkmode-button') && !document.getElementById('userscripts-clearmemory-button')) {
                targetElement.insertAdjacentHTML('afterend', darkModeButtonHTML + clearMemoryButtonHTML);
                
                document.getElementById('userscripts-darkmode-button').addEventListener('click', toggleDarkMode);
                document.getElementById('userscripts-clearmemory-button').addEventListener('click', clearIvuMemory);
            }
        }
    }, 500);

})();