/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                         VARIABLES DE FUNCIONALIDAD                         */
/*                                                                            */
/* -------------------------------------------------------------------------- */

let date = new Date();
let anio_actual = date.getFullYear();
let tab_buttons = document.querySelectorAll(".tab-button");
let tab_panels = document.querySelectorAll(".tab-panel");

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 FUNCIONES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

/* ------------------------------------- */
/* Función para obtener la fecha actual. */
/* ------------------------------------- */
const fecha_a = () => {
	let date = new Date();
	let dia_actual = date.getDate();
	let mes_actual = date.getMonth() + 1;
	let anio_actual = date.getFullYear();
	let fecha = 0;
	let mes = 0;
	let dia = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (dia_actual < 10) {
		dia = "0" + dia_actual;
	} else {
		dia = dia_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (mes_actual < 10) {
		mes = "0" + mes_actual;
	} else {
		mes = mes_actual;
	}

	fecha = anio_actual + "-" + mes + "-" + dia;

	return fecha;
};

/* ---------------------------------------------- */
/* Función para obtener la fecha dividida actual. */
/* ---------------------------------------------- */
const fecha_d_a = () => {
	let date = new Date();
	let dia_actual = date.getDate();
	let mes_actual = date.getMonth() + 1;
	let anio_actual = date.getFullYear();
	let fecha = 0;
	let mes = 0;
	let dia = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (dia_actual < 10) {
		dia = "0" + dia_actual;
	} else {
		dia = dia_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (mes_actual < 10) {
		mes = "0" + mes_actual;
	} else {
		mes = mes_actual;
	}

	let fecha_d = {
		anio_actual: anio_actual,
		mes: mes,
		dia: dia,
	};

	return fecha_d;
};

/* -------------------------------------------- */
/* Función para obtener la fecha y hora actual. */
/* -------------------------------------------- */
const fecha_hora_a = () => {
	let date = new Date();
	let dia_actual = date.getDate();
	let mes_actual = date.getMonth() + 1;
	let anio_actual = date.getFullYear();
	let fecha = 0;
	let mes = 0;
	let dia = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (dia_actual < 10) {
		dia = "0" + dia_actual;
	} else {
		dia = dia_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (mes_actual < 10) {
		mes = "0" + mes_actual;
	} else {
		mes = mes_actual;
	}

	fecha = anio_actual + "-" + mes + "-" + dia;

	let hora_actual = date.getHours();
	let minutos_actual = date.getMinutes();
	let segundos_actual = date.getSeconds();
	let hora = 0;
	let hora_a = 0;
	let minutos = 0;
	let segundos = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (hora_actual < 10) {
		hora_a = "0" + hora_actual;
	} else {
		hora_a = hora_actual;
	}

	// Validamos que la fecha sea legible con cero en el mes...
	if (minutos_actual < 10) {
		minutos = "0" + minutos_actual;
	} else {
		minutos = minutos_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (segundos_actual < 10) {
		segundos = "0" + segundos_actual;
	} else {
		segundos = segundos_actual;
	}

	hora = hora_a + ":" + minutos + ":" + segundos;

	let fecha_Hora = fecha + " " + hora;

	return fecha_Hora;
};

/* --------------------------------------------- */
/* Fución para obtener la fecha con suma de días */
/* --------------------------------------------- */
const fecha_sum = (dias) => {
	let date = new Date();
	let dia_actual = date.getDate() + dias;
	let mes_actual = date.getMonth() + 1;
	let anio_actual = date.getFullYear();
	let fecha = 0;
	let mes = 0;
	let dia = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (dia_actual < 10) {
		dia = "0" + dia_actual;
	} else {
		dia = dia_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (mes_actual < 10) {
		mes = "0" + mes_actual;
	} else {
		mes = mes_actual;
	}

	// Creamos la fecha.
	fecha = anio_actual + "-" + mes + "-" + dia;

	// Retornamos la fecha.
	return fecha;
};

/* ---------------------------------------------------- */
/* Configuración de los Toas. (Notificaciones pequeñas) */
/* ---------------------------------------------------- */
const Toast = Swal.mixin({
	toast: true,
	position: "bottom-end",
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
});

/* ---------------------------------------------------- */
/* Función que genera el número aleatorio de 4 digitos. */
/* ---------------------------------------------------- */
const g_newCodCsv = async (max, min) => {
	let nR_1 = Math.floor(Math.random() * (max - min)) + min;
	let nR_2 = Math.floor(Math.random() * (max - min)) + min;
	let nR_3 = Math.floor(Math.random() * (max - min)) + min;
	let nR_4 = Math.floor(Math.random() * (max - min)) + min;
	let nR_5 = Math.floor(Math.random() * (max - min)) + min;

	return `${nR_1}` + `${nR_2}` + `${nR_3}` + `${nR_4}` + `${nR_5}`;
};

/* ------------------------------------------------- */
/* Función que se llama para descargar los listados. */
/* ------------------------------------------------- */
const descargar_listado = (url, name_archive) => {
	const domloadInstance = document.createElement("a");
	domloadInstance.href = url;
	domloadInstance.target = "_blank";
	domloadInstance.download = name_archive;

	document.body.appendChild(domloadInstance);
	domloadInstance.click();
};

/* ------------------------------------------------ */
/* Función que se llama para descargar los recibos. */
/* ------------------------------------------------ */
const descargar_recibos = (url, name_archive) => {
	const domloadInstance = document.createElement("a");
	domloadInstance.href = url;
	domloadInstance.target = "_blank";
	domloadInstance.download = name_archive;

	document.body.appendChild(domloadInstance);
	domloadInstance.click();
};

/* ------------------------------------------------------------------ */
/*  Función que se llama pra descargar los machotes de El Salvador.   */
/* ------------------------------------------------------------------ */
// Función que se llama pra descargar los machotes...
const descargar_machote = (url, name_archive) => {
	const domloadInstance = document.createElement("a");
	domloadInstance.href = url;
	domloadInstance.target = "_blank";
	domloadInstance.download = name_archive;

	document.body.appendChild(domloadInstance);
	domloadInstance.click();
};

/* ------------------------------------------------------------------ */
/* Función que se llama pra descargar los machotes de Estados Unidos. */
/* ------------------------------------------------------------------ */
const descargar_machote_usa = (url, name_archive) => {
	const domloadInstance = document.createElement("a");
	domloadInstance.href = url;
	domloadInstance.target = "_blank";
	domloadInstance.download = name_archive;

	document.body.appendChild(domloadInstance);
	domloadInstance.click();
};

/* ----------------------------------------- */
/* Funcion para evitar el enter en textarea. */
/* ----------------------------------------- */
const enter_block = (event) => {
	if (event.keyCode == 16 || event.keyCode == 13) {
		event.preventDefault();
		return false;
	}
};

/* ----------------------------------------- */
/* Funcion para las pestañas del contenido.  */
/* ----------------------------------------- */
tab_buttons.forEach((button) => {
	button.addEventListener("click", () => {
		// Eliminar la clase 'active' de todos los botones y paneles
		tab_buttons.forEach((btn) => btn.classList.remove("active"));
		tab_panels.forEach((panel) => panel.classList.remove("active"));

		// Activar el botón y panel correspondiente
		button.classList.add("active");
		const tabId = button.getAttribute("data-tab");
		document.getElementById(`tab-${tabId}`).classList.add("active");
	});
});
