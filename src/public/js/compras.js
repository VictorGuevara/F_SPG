/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 VARIABLES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const list_jsonComprasNoIngresadas = document.getElementById('list_jsonComprasNoIngresadas');

// Campos de filtros.
let fecha_inicio = document.getElementById('fecha_inicio');
let fecha_final = document.getElementById('fecha_final');
let nompre_proveedor = document.getElementById('busqueda_proveedor');
let nompre_producto = document.getElementById('busqueda_prodcuto');
let listProveedores = document.getElementById('lista_proveedores');
let listProductos = document.getElementById('lista_productos');
let tbody_cg = document.getElementById('tableBody');

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
					} else if (control_text.indexOf('DTE-03') !== -1) {
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
				}, 250);
			} else if (datos.mensaje == 'La factura ya ha sido ingresada con el codigo de control porporcionado.') {
				setTimeout(async () => {
					await Swal.fire({
						icon: 'warning',
						text: datos.mensaje,
					});
					await leer_json_data();
				}, 250);
			} else if (datos.mensaje == 'No existe el archivo.') {
				setTimeout(async () => {
					await Swal.fire({
						icon: 'warning',
						title: datos.mensaje,
						text: 'Probablemente ubo un error al mover el archivo al momento de guardarlo.',
					});
					await leer_json_data();
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
		provName: nompre_proveedor.value,
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

// Función que lista los productos para la lista del campo.
const list_productos = async () => {
	// Objeto de datos.
	let dae = {
		prodName: nompre_producto.value,
	};

	// consultamos para guardar los datos de los clientes en la encomienda...
	await fetch('/compras/list_productos', {
		method: 'POST',
		body: JSON.stringify(dae),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			listProductos.innerHTML = '';
			for (var i = 0; i < datos.length; i++) {
				listProductos.innerHTML += `<option value="${datos[i].f_cuerpoDoc_descripcion}">`;
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
		nombre_proveedor: nompre_proveedor.value,
		nombre_producto: nompre_producto.value,
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
				tbody_cg.innerHTML += `
					<tr>
                        <td>${datos[i].emisor_nombre}</td>
                        <td>${datos[i].f_cuerpoDoc_descripcion}</td>
                        <td>${datos[i].f_cuerpoDoc_cantidad}</td>
                        <td>$ ${datos[i].f_cuerpoDoc_precioUni}</td>
                        <td>$ ${datos[i].f_cuerpoDoc_montoDescu}</td>
                        <td>$ ${datos[i].f_cuerpoDoc_ventaGravada}</td>
                    </tr>
				`;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                  EVENTOS                                   */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Ejecutamos la función al inicio..
leer_json_data();
list_proveedores();
list_productos();
list_compras_guardadas();

// Evento de escritura para el campo de proveedores
nompre_proveedor.addEventListener('input', (event) => {
	event.preventDefault();
	list_proveedores();
	list_compras_guardadas();
});

// Evento de escritura para el campo de producto.
nompre_producto.addEventListener('input', (event) => {
	event.preventDefault();
	list_productos();
	list_compras_guardadas();
});
