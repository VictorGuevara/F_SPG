/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 VARIABLES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const list_jsonComprasNoIngresadas = document.getElementById('list_jsonComprasNoIngresadas');

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

			// Limpiamos el contenedor donde se va a presentar los datos.
			list_jsonComprasNoIngresadas.innerHTML = '';

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
				setTimeout(() => {
					Swal.fire({
						icon: 'success',
						title: datos.mensaje,
					});
				}, 250);
			} else if (datos.mensaje == 'La factura ya ha sido ingresada con el codigo de control porporcionado.') {
				setTimeout(() => {
					Swal.fire({
						icon: 'warning',
						text: datos.mensaje,
					});
				}, 250);
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
