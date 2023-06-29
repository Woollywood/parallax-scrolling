// Подключение функционала "Чертоги Фрилансера"
import { isMobile } from './functions.js';

// Подключение списка активных модулей
import { flsModules } from './modules.js';

window.addEventListener('scroll', (e) => {
	document.body.style.cssText += `--scrollTop: ${window.scrollY}px`;
});
