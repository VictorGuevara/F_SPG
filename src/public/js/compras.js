/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 VARIABLES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const list_jsonComprasNoIngresadas = document.getElementById('list_jsonComprasNoIngresadas');

// Campos de filtros.
let fecha_inicio = document.getElementById('fecha_inicio');
let fecha_final = document.getElementById('fecha_final');
let nombre_proveedor = document.getElementById('busqueda_proveedor');
let listProveedores = document.getElementById('lista_proveedores');
let btnFilter = document.getElementById('btn_filter');
let tbody_cg = document.getElementById('tableBody');
let btnPagar = document.getElementById('btn_pagar_pagadas');
let nombre_proveedor_p = document.getElementById('busqueda_proveedor_p');
let btnFilter_p = document.getElementById('btn_filter_p');
let tbody_cp = document.getElementById('tableBody_cync_p');

// De información.
let ruta_carga = document.getElementById('h3_ruta_carga');
let cantJsons = document.getElementById('h1_cantJsons');
let ruta_destino = document.getElementById('h3_ruta_destino');

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 FUNCIONES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const leer_json_data = async () => {
	// Función que genera el menú para cada tipo de usuario...
	await fetch('/compras/list_compras_no_ingresadas', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let data_createFila_compra = [];
			let data_createFila = '';
			let data_string = JSON.stringify(datos);
			let data_noString = JSON.parse(data_string);

			// Contamos la cantidad de archivos encontrados.
			let cant_files = datos.files.length;
			let filas_productos = '';

			// Pasamos los datos a las etiquitas correspondientes.
			ruta_carga.innerHTML = '';
			cantJsons.innerHTML = '';
			ruta_destino.innerHTML = '';
			ruta_carga.innerHTML = datos.carpetas[0];
			cantJsons.innerHTML = cant_files;
			ruta_destino.innerHTML = datos.carpetas[1];

			// Limpiamos el contenedor donde se va a presentar los datos.
			list_jsonComprasNoIngresadas.innerHTML = '';

			// Validamos.
			if (cant_files > 0) {
				// Recorremos el arreglo de datos y los pintamos.
				for (let i = 0; i < cant_files; i++) {
					// Guardamos el total de los archivos encontrados.
					let c_filas_productos = datos.files[i].cuerpoDocumento.length;
					for (var j = 0; j < c_filas_productos; j++) {
						// Agregamos a las variables los datos correspondiente a los datos de los productos comprados.
						filas_productos += `
							<tr>
								<td>${datos.files[i].cuerpoDocumento[j].codigo}</td>
								<td>${datos.files[i].cuerpoDocumento[j].descripcion}</td>
								<td>${datos.files[i].cuerpoDocumento[j].cantidad}</td>
								<td>${datos.files[i].cuerpoDocumento[j].precioUni}</td>
								<td>${datos.files[i].cuerpoDocumento[j].montoDescu}</td>
								<td>${datos.files[i].cuerpoDocumento[j].ventaGravada}</td>
							</tr>
						`;
					}

					// Validamos si es Crédito fiscal o Nota de crédito.
					let control_text = JSON.stringify(datos.files[i].identificacion.numeroControl).replace(/"/g, '');

					if (control_text.indexOf('DTE-05') !== -1) {
						// Datos de documentos relacionados.
						let d_r_nc = [
							datos.files[i].documentoRelacionado[0].tipoDocumento,
							datos.files[i].documentoRelacionado[0].tipoGeneracion,
							datos.files[i].documentoRelacionado[0].numeroDocumento,
							datos.files[i].documentoRelacionado[0].fechaEmision,
						];

						// Agregamos la estructura del article.
						list_jsonComprasNoIngresadas.innerHTML += `
							<article class="notaDeCredito">
								<section class="facE_identificacion">
									<h2>Identificación</h2>
									<p><strong>Control:</strong> ${datos.files[i].identificacion.numeroControl}</p>
									<p><strong>Generación:</strong> ${datos.files[i].identificacion.codigoGeneracion}</p>
									<p><strong>Fecha:</strong> ${datos.files[i].identificacion.fecEmi}</p>
									<p><strong>Hora:</strong> ${datos.files[i].identificacion.horEmi}</p>
								</section>
								<section class="facE_emisor">
									<h2>Emisor</h2>
									<p><strong>Nombre:</strong> ${datos.files[i].emisor.nombre}</p>
									<p><strong>NIT:</strong> ${datos.files[i].emisor.nit} | NRC: ${datos.files[i].emisor.nrc}</p>
									<p><strong>Dirección:</strong> ${datos.files[i].emisor.direccion.complemento}</p>
									<p><strong>Teléfono:</strong> ${datos.files[i].emisor.telefono} | <strong>Email:</strong> ${datos.files[i].emisor.correo}</p>
								</section>
								<section class="facE_detalleProductos">
									<h2>Detalle de la Factura</h2>
									<table border="1" cellpadding="5" cellspacing="0">
										<thead>
											<tr>
												<th>Código</th>
												<th>Descripción</th>
												<th>Cantidad</th>
												<th>Precio Unitario</th>
												<th>Descuento</th>
												<th>Venta Gravada</th>
											</tr>
										</thead>
										<tbody>
											${filas_productos}
										</tbody>
									</table>
								</section>
								<section class="facE_resumen">
									<h2>Resumen</h2>
									<p><strong>Total No Sujeto:</strong> ${datos.files[i].resumen.totalNoSuj}</p>
									<p><strong>Total Exentas:</strong> ${datos.files[i].resumen.totalExenta}</p>
									<p><strong>Total Grabadas:</strong> ${datos.files[i].resumen.totalGravada}</p>
									<p><strong>Subtotal Ventas:</strong> ${datos.files[i].resumen.subTotalVentas}</p>
									<p><strong>Descuentos No Sujetos:</strong> ${datos.files[i].resumen.descuNoSuj}</p>
									<p><strong>Descuentos Exentos:</strong> ${datos.files[i].resumen.descuExenta}</p>
									<p><strong>Descuentos Grabados:</strong> ${datos.files[i].resumen.descuGravada}</p>
									<p><strong>Porcentaje De Descuento:</strong> ${datos.files[i].resumen.porcentajeDescuento}</p>
									<p><strong>Total Descuento:</strong> ${datos.files[i].resumen.totalDescu}</p>
									<p><strong>Subtotal:</strong> ${datos.files[i].resumen.subTotal}</p>
									<p><strong>Iva Percibido:</strong> ${datos.files[i].resumen.ivaPerci1}</p>
									<p><strong>Iva Retenido:</strong> ${datos.files[i].resumen.ivaRete1}</p>
									<p><strong>Retencion De Renta:</strong> ${datos.files[i].resumen.reteRenta}</p>
									<p><strong>Monto Total De Operacion:</strong> ${datos.files[i].resumen.montoTotalOperacion}</p>
									<p><strong>Total No Grabado:</strong> ${datos.files[i].resumen.totalNoGravado}</p>
									<p><strong>Total A Pagar:</strong> ${datos.files[i].resumen.totalPagar}</p>
									<p><strong>Total En Letras:</strong> ${datos.files[i].resumen.totalLetras}</p>
								</section>
								<section class="facE_acciones">
									<h2>Acciones</h2>
									<button class="btn_guardar" onclick="guardar_compra_si('${datos.files[i].file}', '${d_r_nc}')">Guardar</button>
									<button class="btn_eliminar">Eliminar</button>
								</section>
							</article>
							<br>
							<hr>
							<br>
						`;

						// Limpiamos la variable para que guarde las nuevas filas de productos.
						filas_productos = '';
					} else {
						// Datos de documentos relacionados.
						let d_r = [0, 0, 0, 0];

						// Agregamos la estructura del article.
						list_jsonComprasNoIngresadas.innerHTML += `
							<article>
								<section class="facE_identificacion">
									<h2>Identificación</h2>
									<p><strong>Control:</strong> ${datos.files[i].identificacion.numeroControl}</p>
									<p><strong>Generación:</strong> ${datos.files[i].identificacion.codigoGeneracion}</p>
									<p><strong>Fecha:</strong> ${datos.files[i].identificacion.fecEmi}</p>
									<p><strong>Hora:</strong> ${datos.files[i].identificacion.horEmi}</p>
								</section>
								<section class="facE_emisor">
									<h2>Emisor</h2>
									<p><strong>Nombre:</strong> ${datos.files[i].emisor.nombre}</p>
									<p><strong>NIT:</strong> ${datos.files[i].emisor.nit} | NRC: ${datos.files[i].emisor.nrc}</p>
									<p><strong>Dirección:</strong> ${datos.files[i].emisor.direccion.complemento}</p>
									<p><strong>Teléfono:</strong> ${datos.files[i].emisor.telefono} | <strong>Email:</strong> ${datos.files[i].emisor.correo}</p>
								</section>
								<section class="facE_detalleProductos">
									<h2>Detalle de la Factura</h2>
									<table border="1" cellpadding="5" cellspacing="0">
										<thead>
											<tr>
												<th>Código</th>
												<th>Descripción</th>
												<th>Cantidad</th>
												<th>Precio Unitario</th>
												<th>Descuento</th>
												<th>Venta Gravada</th>
											</tr>
										</thead>
										<tbody>
											${filas_productos}
										</tbody>
									</table>
								</section>
								<section class="facE_resumen">
									<h2>Resumen</h2>
									<p><strong>Total No Sujeto:</strong> ${datos.files[i].resumen.totalNoSuj}</p>
									<p><strong>Total Exentas:</strong> ${datos.files[i].resumen.totalExenta}</p>
									<p><strong>Total Grabadas:</strong> ${datos.files[i].resumen.totalGravada}</p>
									<p><strong>Subtotal Ventas:</strong> ${datos.files[i].resumen.subTotalVentas}</p>
									<p><strong>Descuentos No Sujetos:</strong> ${datos.files[i].resumen.descuNoSuj}</p>
									<p><strong>Descuentos Exentos:</strong> ${datos.files[i].resumen.descuExenta}</p>
									<p><strong>Descuentos Grabados:</strong> ${datos.files[i].resumen.descuGravada}</p>
									<p><strong>Porcentaje De Descuento:</strong> ${datos.files[i].resumen.porcentajeDescuento}</p>
									<p><strong>Total Descuento:</strong> ${datos.files[i].resumen.totalDescu}</p>
									<p><strong>Subtotal:</strong> ${datos.files[i].resumen.subTotal}</p>
									<p><strong>Iva Percibido:</strong> ${datos.files[i].resumen.ivaPerci1}</p>
									<p><strong>Iva Retenido:</strong> ${datos.files[i].resumen.ivaRete1}</p>
									<p><strong>Retencion De Renta:</strong> ${datos.files[i].resumen.reteRenta}</p>
									<p><strong>Monto Total De Operacion:</strong> ${datos.files[i].resumen.montoTotalOperacion}</p>
									<p><strong>Total No Grabado:</strong> ${datos.files[i].resumen.totalNoGravado}</p>
									<p><strong>Total A Pagar:</strong> ${datos.files[i].resumen.totalPagar}</p>
									<p><strong>Total En Letras:</strong> ${datos.files[i].resumen.totalLetras}</p>
								</section>
								<section class="facE_acciones">
									<h2>Acciones</h2>
									<button class="btn_guardar" onclick="guardar_compra_si('${datos.files[i].file}', '${d_r}')">Guardar</button>
									<button class="btn_eliminar">Eliminar</button>
								</section>
							</article>
							<br>
							<hr>
							<br>
						`;

						// Limpiamos la variable para que guarde las nuevas filas de productos.
						filas_productos = '';
					}
				}
			} else {
				// Agregamos la estructura del article.
				list_jsonComprasNoIngresadas.innerHTML += `
					<article>
						<h2>No se encuentran archivos JSON para cargar...</h2>
					</article>
					<br>
					<hr>
					<br>
				`;
			}
		})
		.catch((error) => {
			// console.error('Ocurrio un error: ', error);
		});
};

const guardar_compra_si = async (nombre_json, datos_dr) => {
	// Transformamos el dato a array.
	datos_dr = datos_dr.split(',').map((item) => item.trim());

	// datos json:
	let nombreJSON = {
		json_name: nombre_json,
		data_dr: datos_dr,
	};

	// consultamos para guardar los datos de los clientes en la encomienda...
	await fetch('/compras/g_compra_SI', {
		method: 'POST',
		body: JSON.stringify(nombreJSON),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Compra guardada.') {
				setTimeout(async () => {
					await Swal.fire({
						icon: 'success',
						title: datos.mensaje,
					});
					await leer_json_data();
					await list_proveedores();
					await list_compras_guardadas();
				}, 250);
			} else if (datos.mensaje == 'La factura ya ha sido ingresada con el codigo de control porporcionado.') {
				setTimeout(async () => {
					await Swal.fire({
						icon: 'warning',
						text: datos.mensaje,
					});
					await leer_json_data();
					await list_proveedores();
					await list_compras_guardadas();
				}, 250);
			} else if (datos.mensaje == 'No existe el archivo.') {
				setTimeout(async () => {
					await Swal.fire({
						icon: 'warning',
						title: datos.mensaje,
						text: 'Probablemente ubo un error al mover el archivo al momento de guardarlo.',
					});
					await leer_json_data();
					await list_proveedores();
					await list_compras_guardadas();
				}, 250);
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función que lista los proveedores para la lista del campo.
const list_proveedores = async () => {
	// Objeto de datos.
	let dae = {
		provName: nombre_proveedor.value,
	};

	// consultamos para guardar los datos de los clientes en la encomienda...
	await fetch('/compras/list_proveedores', {
		method: 'POST',
		body: JSON.stringify(dae),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			listProveedores.innerHTML = '';
			for (var i = 0; i < datos.length; i++) {
				listProveedores.innerHTML += `<option value="${datos[i].emisor_nombre}">`;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función que lista los datos en la tabla de compras guardadas.
const list_compras_guardadas = async () => {
	// Validamos que los datos no esten vacios.
	if (fecha_inicio.value == '' || fecha_final.value == '') {
		fecha_inicio.value = fecha_a();
		fecha_final.value = fecha_a();
	}

	// datos json:
	let datos_filtro = {
		fecha_i: fecha_inicio.value,
		fecha_f: fecha_final.value,
		nombre_proveedor: nombre_proveedor.value,
	};

	// consultamos para guardar los datos de los clientes en la encomienda...
	await fetch('/compras/list_compras_SI', {
		method: 'POST',
		body: JSON.stringify(datos_filtro),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			tbody_cg.innerHTML = '';
			for (var i = 0; i < datos.length; i++) {
				let clase_css_tr = '';
				let tipe_check_nc = '';
				let total_factura = 0;
				let nControlDTE = JSON.stringify(datos[i].ident_numeroControl).replace(/"/g, '');

				// Validamos si es nota de crédito...
				if (nControlDTE.indexOf('DTE-05') !== -1) {
					clase_css_tr = 'red';
					tipe_check_nc = '_ntc';
					total_factura = datos[i].resumen_montoTotalOperacion;
				} else {
					tipe_check_nc = '';
					clase_css_tr = '';
					total_factura = datos[i].resumen_totalPagar;
				}

				tbody_cg.innerHTML += `
					<tr class="${clase_css_tr}">
                        <td class="center_text"><input type="checkbox" class="fila_checkbox${tipe_check_nc}"></td>
                        <td><input type="hidden" name="id_h_codGeneracion" value="${datos[i].ident_codigoGeneracion}">${datos[i].ident_numeroControl}</td>
                        <td>${datos[i].emisor_nombre}</td>
                        <td>$ <span class="valor">${total_factura}</span></td>
                        <td><span class="valor">${datos[i].estado_pago}</span></td>
                        <td class="center_text">
                        	<button class="btn_table_delete" onclick="eliminar_registro('${datos[i].ident_codigoGeneracion}')"><i class="ti-trash"></i></button>
                        </td>
                    </tr>
				`;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	await actualizarTotal();
};

// Función que actualiza el total de los montos de las filas seleccionadas.
const actualizarTotal = () => {
	// Variables que capturan los datos.
	let checkboxes = document.querySelectorAll('.fila_checkbox');
	let checkboxes_nt = document.querySelectorAll('.fila_checkbox_ntc');
	let totalSpan_nnc = document.getElementById('info_total_nnc');
	let totalSpan_nc = document.getElementById('info_total_nc');
	let totalSpan = document.getElementById('info_total');
	let total_nnc = 0;
	let total_nc = 0;
	let total = 0;

	// Recorremos los checkbox que no son de filas de notas de credito.
	checkboxes.forEach((checkbox) => {
		if (checkbox.checked) {
			const fila = checkbox.closest('tr');
			const valor = parseFloat(fila.querySelector('.valor').textContent);
			total_nnc += valor;
		}
	});

	// Recorremos los checkbox que son de filas de notas de credito.
	checkboxes_nt.forEach((checkbox) => {
		if (checkbox.checked) {
			const fila = checkbox.closest('tr');
			const valor = parseFloat(fila.querySelector('.valor').textContent);
			total_nc += valor;
		}
	});

	// Pintamos los totales.
	totalSpan_nnc.textContent = total_nnc.toFixed(2);
	totalSpan_nc.textContent = total_nc.toFixed(2);
	total = total_nnc.toFixed(2) - total_nc.toFixed(2);
	totalSpan.textContent = total.toFixed(2);

	// Colocamos a cada checkbox su función.
	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('change', actualizarTotal);
	});

	checkboxes_nt.forEach((checkbox) => {
		checkbox.addEventListener('change', actualizarTotal);
	});
};

// Función para pagar las compras y notas de créditos seleccionados..
const guardar_cnc_selecionados = async () => {
	const tbody = document.getElementById('tableBody');
	const filas = tbody.getElementsByTagName('tr');
	const seleccionadas = [];
	let total_creditos = parseFloat(document.getElementById('info_total_nnc').innerText);
	let total_notasCreditos = parseFloat(document.getElementById('info_total_nc').innerText);

	for (let i = 0; i < filas.length; i++) {
		const checkbox = filas[i].querySelector("input[type='checkbox']");
		if (checkbox && checkbox.checked) {
			seleccionadas.push(filas[i]);
		}
	}

	let filas_selec = seleccionadas.length;

	// Validamos que los campos requeridos esten llenos.
	if (nombre_proveedor.value == '') {
		await Swal.fire({
			icon: 'error',
			title: 'Campo Requerido',
			text: 'Por favor, seleccione el nombre del Proveedor o Drogueria.',
		});
	} else if (filas_selec <= 0) {
		await Swal.fire({
			icon: 'error',
			title: 'Campo Requerido',
			text: 'Por favor, seleccione al menos una de las filas de la tabla.',
		});
	} else if (filas_selec > 0 && total_notasCreditos >= total_creditos) {
		await Swal.fire({
			icon: 'error',
			title: 'Montos no operables',
			text: 'El monto de la Nota/s De Crédito/s seleccionada/s, supera al monto de la/s factura/s de crédito/s seleccionado/s.',
		});
	} else {
		// Array que guarda los datos a acutalizar...
		let datos_actualizar = [];

		// Recorremos todas las filas seleccionadas.
		for (let i = 0; i < filas_selec; i++) {
			const checkbox = filas[i].querySelector("input[type='checkbox']");
			const idhCodGeneracion = filas[i].querySelector("input[name='id_h_codGeneracion']");
			if (checkbox && checkbox.checked) {
				let n_proveedor = nombre_proveedor.value;
				let n_generacion = idhCodGeneracion.value;
				let monto = parseFloat(filas[i].querySelector('td span.valor').innerText);

				// Agregamos los objetos de datos...
				datos_actualizar.push({ id: n_generacion, proveedor: n_proveedor, monto: monto, estado: 'Pagado' });
			}
		}

		await fetch('/compras/g_compras_pagadas', {
			method: 'POST',
			body: JSON.stringify(datos_actualizar),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((datos) => {
				if (datos.mensaje == 'Compras pagadas.') {
					setTimeout(async () => {
						await Swal.fire({
							icon: 'success',
							title: datos.mensaje,
						});
						await leer_json_data();
						await list_proveedores();
						await list_compras_guardadas();
					}, 250);
				}
			})
			.catch((error) => {
				console.error('Ocurrio un error: ', error);
			});
	}
};

// Función que lista los datos en la tabla de compras pagadas.
const list_compras_pagadas = async () => {
	// Validamos que los datos no esten vacios.
	if (fecha_inicio_p.value == '' || fecha_final_p.value == '') {
		fecha_inicio_p.value = fecha_a();
		fecha_final_p.value = fecha_a();
	}

	// datos json:
	let datos_filtro = {
		fecha_i: fecha_inicio_p.value,
		fecha_f: fecha_final_p.value,
		nombre_proveedor: nombre_proveedor_p.value,
	};

	// consultamos para guardar los datos de los clientes en la encomienda...
	await fetch('/compras/list_compras_pagadas', {
		method: 'POST',
		body: JSON.stringify(datos_filtro),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			tbody_cp.innerHTML = '';
			for (var i = 0; i < datos.length; i++) {
				let clase_css_tr = '';
				let tipe_check_nc = '';
				let total_factura = 0;
				let nControlDTE = JSON.stringify(datos[i].ident_numeroControl).replace(/"/g, '');

				// Validamos si es nota de crédito...
				if (nControlDTE.indexOf('DTE-05') !== -1) {
					clase_css_tr = 'red';
					tipe_check_nc = '_ntc';
					total_factura = datos[i].resumen_montoTotalOperacion;
				} else {
					tipe_check_nc = '';
					clase_css_tr = '';
					total_factura = datos[i].resumen_totalPagar;
				}

				tbody_cp.innerHTML += `
					<tr class="${clase_css_tr}">
                        <td class="center_text"><input type="checkbox" class="fila_checkbox${tipe_check_nc}"></td>
                        <td><input type="hidden" name="id_h_codGeneracion" value="${datos[i].ident_codigoGeneracion}">${datos[i].ident_numeroControl}</td>
                        <td>${datos[i].emisor_nombre}</td>
                        <td>$ <span class="valor">${total_factura}</span></td>
                        <td><span class="valor">${datos[i].estado_pago}</span></td>
                        <td class="center_text">
                        	<button class="btn_table_reverse" onclick="pasar_aNoPagado('${datos[i].ident_codigoGeneracion}')"><i class="ti-back-left"></i></button>
                        </td>
                    </tr>
				`;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	await actualizarTotal();
};

// Función que elimina la compra registrada proveniente del JSON.
const eliminar_registro = (reg_codGeneracion) => {
	console.log(reg_codGeneracion);
};

// Función que elimina la compra pagada y la pasa a compra no pagada.
const pasar_aNoPagado = (reg_codGeneracion) => {
	console.log(reg_codGeneracion);
};

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                  EVENTOS                                   */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Ejecutamos la función al inicio..
setTimeout(async () => {
	await leer_json_data();
	await list_proveedores();
	await list_compras_guardadas();
	await list_compras_pagadas();
	await actualizarTotal();
}, 500);

// Evento de escritura para el campo de proveedores.
nombre_proveedor.addEventListener('input', async (event) => {
	event.preventDefault();
	await list_proveedores();
	await list_compras_guardadas();
});

// Evento doble clic para limpiar el campo de proveedor.
nombre_proveedor.addEventListener('dblclick', async (event) => {
	event.preventDefault();
	nombre_proveedor.value = '';
});

// Evento clic para el boton de filtrar.
btnFilter.addEventListener('click', async (event) => {
	event.preventDefault();
	await list_compras_guardadas();
	await list_compras_pagadas();
});

// Evento click para le boton de pagar seleccionadas.
btnPagar.addEventListener('click', async (event) => {
	event.preventDefault();
	await guardar_cnc_selecionados();
});

// Evento clic para el boton de filtrar las compras pagadas.
btnFilter_p.addEventListener('click', async () => {
	await list_compras_pagadas();
	await list_compras_guardadas();
});

// Evento de escritura para el campo de proveedores de compras pagadas.
nombre_proveedor_p.addEventListener('input', async (event) => {
	event.preventDefault();
	await list_proveedores();
	await list_compras_pagadas();
});
