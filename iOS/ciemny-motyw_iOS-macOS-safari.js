// ==UserScript==
// @name         IVU.plan Dark Mode
// @namespace    https://github.com/quoid/userscripts
// @version      1.3
// @match        *://irena1.intercity.pl/*
// @match        *://portal.intercity.pl/*
// @require      https://cdn.jsdelivr.net/npm/darkreader@4.9.120/darkreader.min.js
// @grant        none
// @updateURL    https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/ciemny-motyw_iOS-macOS-safari.js
// @downloadURL  https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/ciemny-motyw_iOS-macOS-safari.js
// ==/UserScript==

/*
 * Version: 1.3
 * Updated: 2026-03-10
 * Changes: Dodano link do aktualizacji.
 */

(function() {
    'use strict';

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

    const buttonHTML = `
        <a id="userscripts-darkmode-button" class="ivupad-action-button ivupad-action-button--round">
            <span><i class="material-icons" aria-hidden="true">brightness_6</i></span>
        </a>`;

    const checkExist = setInterval(function() {
        const targetElement = document.querySelector('#ivupad-button-main-user'); 

        if (targetElement) {
            clearInterval(checkExist);
            targetElement.insertAdjacentHTML('afterend', buttonHTML);
            document.getElementById('userscripts-darkmode-button').addEventListener('click', toggleDarkMode);
        }
    }, 500);

})();