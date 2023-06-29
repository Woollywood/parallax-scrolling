/* Календарь*/

// Подключение функционала "Чертоги Фрилансера"
// Подключение списка активных модулей
import { flsModules } from "../modules.js";

// Подключение модуля
import datepicker from "js-datepicker";

if (document.querySelector("[data-datepicker]")) {
	const picker = datepicker("[data-datepicker]", {
		customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
		customMonths: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		overlayButton: "Применить",
		overlayPlaceholder: "Год (4 цифры)",
		startDay: 1,
		formatter: (input, date, instance) => {
			const value = date.toLocaleDateString();
			input.value = value;
		},
		onSelect: function (input, instance, date) {},
	});
	flsModules.datepicker = picker;
}
