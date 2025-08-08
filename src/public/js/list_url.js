/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 VARIABLES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Obtenemos la url.
let url_active = window.location.pathname;
let palabraEdit = url_active.search("editEncsv");
let palabraEditUsa = url_active.search("editEncUsa");
let palabraEditCompraSV = url_active.search("editCompraSV");
let palabraEditCompra = url_active.search("editCompraUsa");
let nameU = document.getElementById("name_user_loger");

// Capturamos la etiqueta script.
let e_script = document.getElementById("script_js");
let e_script_tow = document.getElementById("script_js_tow");

// Capturamos la etiqueta link.
let e_css = document.getElementById("script_css");

// Capturamos todas las etiquetas "a"
let ul_box = document.querySelectorAll("#list_items_menu li a");
let nu = document.querySelector("#n_user_cargo");

// Variable de tiempo.
const tiempo_eCarga = 500;

// Capturamos las etiquetas para los eventos del sidebars.
let menu_li = document.querySelectorAll(".menu > ul > li");
let menu_btns = document.querySelector(".menu-btn");
let etic_sidebars = document.querySelector(".sidebar");
let etic_content_sidebars = document.querySelector(".main_content");

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                              GERENTE GENERAL                               */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Función que genera el menú para cada tipo de usuario...
const listItems_menu = async () => {
	await fetch("/menu/menu", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let ul = document.querySelector("#list_items_menu");
			ul.innerHTML = "";

			for (var i = 0; i < datos.menu_items.length; i++) {
				if (
					datos.menu_items[i].id_menu > 0 &&
					datos.menu_items[i].id_menu < 90 &&
					datos.menu_items[i].esex_admin > 0 &&
					nu.value == "Administrador" &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				} else if (
					datos.menu_items[i].id_menu > 0 &&
					datos.menu_items[i].id_menu < 90 &&
					datos.menu_items[i].atenc_esex_oficina > 0 &&
					nu.value == "Atenc. Esex" &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				} else if (
					datos.menu_items[i].id_menu > 0 &&
					datos.menu_items[i].id_menu < 90 &&
					datos.menu_items[i].atenc_esex_general > 0 &&
					nu.value == "Atenc. G. Esex" &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				} else if (
					datos.menu_items[i].id_menu > 0 &&
					datos.menu_items[i].id_menu < 90 &&
					datos.menu_items[i].atenc_esex_equipaje > 0 &&
					nu.value == "equipaje" &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				} else if (
					datos.menu_items[i].id_menu > 0 &&
					datos.menu_items[i].id_menu < 90 &&
					datos.menu_items[i].atenc_esex_global > 0 &&
					nu.value == "Atenc. Esex Global" &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				} else if (
					datos.menu_items[i].id_menu > 0 &&
					datos.menu_items[i].id_menu < 90 &&
					datos.menu_items[i].esex_quejas > 0 &&
					nu.value == "Atenc. Esex Quejas" &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				} else if (
					datos.menu_items[i].id_menu > 0 &&
					datos.menu_items[i].id_menu < 90 &&
					datos.menu_items[i].atenc_esex_usa > 0 &&
					nu.value == "Atenc. Esex USA" &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				} else if (
					datos.menu_items[i].id_menu > 0 &&
					datos.menu_items[i].id_menu < 90 &&
					datos.menu_items[i].atenc_gs_sv > 0 &&
					nu.value == "Atenc. GS SV" &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				} else if (
					datos.menu_items[i].id_menu > 0 &&
					datos.menu_items[i].id_menu < 90 &&
					datos.menu_items[i].atenc_gs_usa > 0 &&
					nu.value == "Atenc. GS USA" &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				}
			}
		})
		.catch((error) => {
			// console.error('Ocurrio un error: ', error);
		});
};

// Función que genera el menú para cada tipo de usuario...
const listItems_menu_cuenta = async () => {
	await fetch("/menu/menu", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let ul = document.querySelector("#list_items_menu_cuenta");
			ul.innerHTML = "";

			for (var i = 0; i < datos.menu_items.length; i++) {
				if (
					datos.menu_items[i].esex_admin > 0 &&
					datos.menu_items[i].id_menu > 90 &&
					datos.menu_items[i].estado_menu == 1
				) {
					ul.innerHTML += `
						<li>
							<a href="${datos.menu_items[i].url_menu}">
								<span class="${datos.menu_items[i].icon_menu}"></span>
								<span class="text" style="text-transform: capitalize">${datos.menu_items[i].name_menu}</span>
							</a>
						</li>
					`;
				}
			}
		})
		.catch((error) => {
			// console.error('Ocurrio un error: ', error);
		});
};

// Fución que coloca para cada vista su respectivo link css y js...
const list_menu = async () => {
	if (url_active == "/" || url_active == "/signin") {
		e_css.href = "../css/var_colores.css";
		e_script_tow.src = "";
	} else {
		await fetch("/menu/menu", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((datos) => {
				for (var i = 0; i < datos.menu_items.length; i++) {
					if (url_active == datos.menu_items[i].url_menu) {
						e_script_tow.src = "/js/FDR.js";
						setTimeout(() => {
							e_script.src = datos.menu_items[i].js_menu;
							e_css.href = datos.menu_items[i].css_menu;
						}, tiempo_eCarga);
						break;
					}
				}
			})
			.catch((error) => {
				console.error("Ocurrio un error: ", error);
			});
	}

	if (palabraEdit == 13) {
		setTimeout(() => {
			e_script_tow.src = "/js/FDR.js";
			e_script.src = "/js/encsv_edit.js";
			e_css.href = "/css/var_colores.css";
		}, tiempo_eCarga);
	} else if (palabraEditUsa == 17) {
		setTimeout(() => {
			e_script_tow.src = "/js/FDR.js";
			e_script.src = "/js/encusa_edit.js";
			e_css.href = "/css/var_colores.css";
		}, tiempo_eCarga);
	} else if (palabraEditCompraSV == 19) {
		setTimeout(() => {
			e_script_tow.src = "/js/FDR.js";
			e_script.src = "/js/compraedit_sv.js";
			e_css.href = "/css/var_colores.css";
		}, tiempo_eCarga);
	} else if (palabraEditCompra == 20) {
		setTimeout(() => {
			e_script_tow.src = "/js/FDR.js";
			e_script.src = "/js/compraedit_usa.js";
			e_css.href = "/css/var_colores.css";
		}, tiempo_eCarga);
	}
};

// Ejecutamos la función al inicio..
document.addEventListener("DOMContentLoaded", () => {
	list_menu();
	listItems_menu();
	listItems_menu_cuenta();
});

// Manejo de clic en los elementos del menú
menu_li.forEach(function (li) {
	li.addEventListener("click", function (e) {
		const siblings = [...li.parentElement.children].filter(
			(el) => el !== li,
		);

		// Quitar clase "active" de los hermanos
		siblings.forEach((sib) => sib.classList.remove("active"));

		// Alternar clase "active" en el elemento actual
		li.classList.toggle("active");

		// Alternar visibilidad de su submenú si lo tiene
		const subMenu = li.querySelector("ul");
		if (subMenu) {
			subMenu.style.display =
				subMenu.style.display === "block" ? "none" : "block";
		}

		// Cerrar submenús de hermanos
		siblings.forEach((sib) => {
			const sibSubMenu = sib.querySelector("ul");
			if (sibSubMenu) {
				sibSubMenu.style.display = "none";
			}

			// Quitar clase "active" de ítems del submenú
			sib.querySelectorAll("ul li").forEach((subLi) =>
				subLi.classList.remove("active"),
			);
		});
	});
});

// Manejo de clic en botón del menú lateral
menu_btns.addEventListener("click", async () => {
	await etic_sidebars.classList.toggle("active");
	await etic_content_sidebars.classList.toggle(
		"main_content_compac_sidebars",
	);
});
