// Подключение плагина из node_modules
import SimpleBar from "simplebar";
// Подключение стилей из node_modules
import "simplebar/dist/simplebar.css";

// Добавляем в блок атрибут data-simplebar
// Также можно инициализировать следующим кодом, используя настройки
/*
if (document.querySelectorAll('[data-simplebar]').length) {
	document.querySelectorAll('[data-simplebar]').forEach(scrollBlock => {
		new SimpleBar(scrollBlock, {
			autoHide: false
		});
	});
}
*/

// Кастомный скролл для body (Не рекомендуется документацией, но почему бы и нет???)
new SimpleBar(document.querySelector('body'));
