/* -------------------------------------------------------------------------- */
/*                               IMPORTACIONES                                */
/* -------------------------------------------------------------------------- */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pool = require('../database');
const { isLoggedIn, authCiudad } = require('../lib/auth');

// Creamos la variable que guarda la ruta de la carpeta que contiene las facturas en JSON.
const ruta_carp_descargas = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads');
const carpetaOrigen = '/';
const carpetaDestino = 'ComprasGuardadas';

/* -------------------------------------------------------------------------- */
/*                                   RUTAS                                    */
/* -------------------------------------------------------------------------- */

// Ruta de renderizar la vista de compras.
router.get('/', isLoggedIn, async (req, res) => {
	// Renderizamos la vista de compras...
	await res.render('admin/compras');
});

// Ruta para listar los JSON de compras que no estan ingresadas.
router.post('/list_compras_no_ingresadas', isLoggedIn, async (req, res) => {
	// Leemos la carpeta y obetenemos todos los archivos JSON encontrados.
	await fs.readdir(ruta_carp_descargas, (err, files) => {
		// Retornamos el mensaje de error si no existe la carpeta.
		if (err) return res.send('Error leyendo la carpeta');

		// Variables que contiene los archivos JSON.
		const jsonFiles = files.filter((file) => file.endsWith('.json'));
		const dataRows = [];
		const cont_files_json = jsonFiles.length;

		// Validamos el contador.
		if (cont_files_json >= 25) {
			cont_files_json == 25;
		}

		// Recorremos los archivos y los leemos, para obtener sus datos.
		for (let i = 0; i < cont_files_json; i++) {
			const file = jsonFiles[i];
			const filePath = path.join(ruta_carp_descargas, file);
			// Condicionamos para agregar los archivos que si se pueden leer de los que no al array.
			try {
				const rawData = fs.readFileSync(filePath, 'utf-8');
				const jsonData = JSON.parse(rawData);
				dataRows.push({ file, ...jsonData });
			} catch (err) {
				dataRows.push({
					file,
					error: 'Error al leer/parsing el archivo',
				});
			}
		}

		// Rutas de carpetas a utilizar.
		let carpetas = [ruta_carp_descargas + carpetaOrigen, ruta_carp_descargas + '/' + carpetaDestino];

		// Devolvemos el array de datos.
		res.json({ files: dataRows, carpetas });
	});
});

// Ruta para guardar las compras en la Farmacia Santa Isabel.
router.post('/g_compra_SI', isLoggedIn, async (req, res) => {
	// Capturamos el nombre del archivo enviado.
	let fileName = req.body.json_name;
	let dataDR = req.body.data_dr;

	// Creamos la variable que busca la carpeta de descargas.
	const filePath = path.join(ruta_carp_descargas, fileName);

	// Leemos y parseamos el archivo JSON
	const rawData = fs.readFileSync(filePath, 'utf-8');
	const jsonData = JSON.parse(rawData);

	// Contamos cuantos productos trae el JSON.
	let cant_productos = jsonData.cuerpoDocumento.length;

	// Recorremos el subobjeto de productos del json, para crear el objeto a guardar.
	// Variables.
	let array_productos = [];
	let producto_objet = 0;

	// Ciclo.
	for (var i = 0; i < cant_productos; i++) {
		producto_objet = [
			// Datos de identificación.
			jsonData.identificacion.version,
			jsonData.identificacion.ambiente,
			jsonData.identificacion.tipoDte,
			jsonData.identificacion.numeroControl,
			jsonData.identificacion.codigoGeneracion,
			jsonData.identificacion.tipoModelo,
			jsonData.identificacion.tipoOperacion,
			jsonData.identificacion.tipoContingencia,
			jsonData.identificacion.motivoContin,
			jsonData.identificacion.fecEmi,
			jsonData.identificacion.horEmi,
			jsonData.identificacion.tipoMoneda,

			// Datos de documentos relacionados.
			dataDR[0],
			dataDR[1],
			dataDR[2],
			dataDR[3],

			// Datos del emisor.
			jsonData.emisor.nit,
			jsonData.emisor.nrc,
			jsonData.emisor.nombre,
			jsonData.emisor.codActividad,
			jsonData.emisor.descActividad,
			jsonData.emisor.nombreComercial,
			jsonData.emisor.tipoEstablecimiento,
			jsonData.emisor.direccion.departamento,
			jsonData.emisor.direccion.municipio,
			jsonData.emisor.direccion.complemento,
			jsonData.emisor.telefono,
			jsonData.emisor.correo,
			jsonData.emisor.codEstableMH,
			jsonData.emisor.codEstable,
			jsonData.emisor.codPuntoVentaMH,
			jsonData.emisor.codPuntoVenta,

			// Datos del receptor.
			jsonData.receptor.nit,
			jsonData.receptor.nrc,
			jsonData.receptor.nombre,
			jsonData.receptor.codActividad,
			jsonData.receptor.descActividad,
			jsonData.receptor.nombreComercial,
			jsonData.receptor.direccion.departamento,
			jsonData.receptor.direccion.municipio,
			jsonData.receptor.direccion.complemento,
			jsonData.receptor.telefono,
			jsonData.receptor.correo,

			// Productos.
			jsonData.cuerpoDocumento[i].numItem,
			jsonData.cuerpoDocumento[i].tipoItem,
			jsonData.cuerpoDocumento[i].numeroDocumento,
			jsonData.cuerpoDocumento[i].cantidad,
			jsonData.cuerpoDocumento[i].codigo,
			jsonData.cuerpoDocumento[i].codTributo,
			jsonData.cuerpoDocumento[i].uniMedida,
			jsonData.cuerpoDocumento[i].descripcion,
			jsonData.cuerpoDocumento[i].precioUni,
			jsonData.cuerpoDocumento[i].montoDescu,
			jsonData.cuerpoDocumento[i].ventaNoSuj,
			jsonData.cuerpoDocumento[i].ventaExenta,
			jsonData.cuerpoDocumento[i].ventaGravada,
			jsonData.cuerpoDocumento[i].tributos[0],
			jsonData.cuerpoDocumento[i].psv,
			jsonData.cuerpoDocumento[i].noGravado,

			// Datos de resumen de los montos de la factura.
			jsonData.resumen.totalNoSuj,
			jsonData.resumen.totalExenta,
			jsonData.resumen.totalGravada,
			jsonData.resumen.subTotalVentas,
			jsonData.resumen.descuNoSuj,
			jsonData.resumen.descuExenta,
			jsonData.resumen.descuGravada,
			jsonData.resumen.porcentajeDescuento,
			jsonData.resumen.totalDescu,
			jsonData.resumen.tributos[0].codigo,
			jsonData.resumen.tributos[0].descripcion,
			jsonData.resumen.tributos[0].valor,
			jsonData.resumen.subTotal,
			jsonData.resumen.ivaPerci1,
			jsonData.resumen.ivaRete1,
			jsonData.resumen.reteRenta,
			jsonData.resumen.montoTotalOperacion,
			jsonData.resumen.totalNoGravado,
			jsonData.resumen.totalPagar,
			jsonData.resumen.totalLetras,
			jsonData.resumen.saldoFavor,
			jsonData.resumen.condicionOperacion,
			jsonData.resumen.pagos,
			jsonData.resumen.numPagoElectronico,

			// Datos del sello de recibido.
			jsonData.selloRecibido,
		];
		array_productos.push(producto_objet);
	}

	// Hacemos una validación del código de generación de hacienda para que no se repita.
	await pool.query(
		`SELECT ident_codigoGeneracion FROM fsp_compras_si WHERE ident_codigoGeneracion = ?`,
		[jsonData.identificacion.codigoGeneracion],
		async (error, rows, fields) => {
			// Validamos:
			if (!error && rows.length > 0) {
				// Si no existe error, devolvemos el mensaje.
				res.json({ mensaje: 'La factura ya ha sido ingresada con el codigo de control porporcionado.' });
			} else {
				// Ejecutamos la consulta para guardar la compra mediante el JSON.
				await pool.query(
					`
					INSERT INTO fsp_compras_si (
						ident_version, 
						ident_ambiente, 
						ident_tipoDte, 
						ident_numeroControl, 
						ident_codigoGeneracion, 
						ident_tipoModelo, 
						ident_tipoOperacion, 
						ident_tipoContingencia, 
						ident_motivoContin, 
						ident_fecEmi, 
						ident_horEmi, 
						ident_tipoMoneda, 

						dr_tipoDocumento, 
						dr_tipoGeneracion, 
						dr_numeroDocumento, 
						dr_fechaEmision, 
					
						emisor_nit, 
						emisor_nrc, 
						emisor_nombre, 
						emisor_codActividad, 
						emisor_descActividad, 
						emisor_nombreComercial, 
						emisor_tipoEstablecimiento, 
						emisor_dir_departamento, 
						emisor_dir_municipio, 
						emisor_dir_complemento, 
						emisor_telefono, 
						emisor_correo, 
						emisor_codEstableMH, 
						emisor_codEstable, 
						emisor_codPuntoVentaMH, 
						emisor_codPuntoVenta, 

						receptor_nit, 
						receptor_nrc, 
						receptor_nombre, 
						receptor_codActividad, 
						receptor_descActividad, 
						receptor_nombreComercial, 
						receptor_dir_departamento, 
						receptor_dir_municipio, 
						receptor_dir_complemento, 
						receptor_telefono, 
						receptor_correo, 

						f_cuerpoDoc_numItem, 
						f_cuerpoDoc_tipoItem, 
						f_cuerpoDoc_numeroDocumento, 
						f_cuerpoDoc_cantidad, 
						f_cuerpoDoc_codigo, 
						f_cuerpoDoc_codTributo, 
						f_cuerpoDoc_uniMedida, 
						f_cuerpoDoc_descripcion, 
						f_cuerpoDoc_precioUni, 
						f_cuerpoDoc_montoDescu, 
						f_cuerpoDoc_ventaNoSuj, 
						f_cuerpoDoc_ventaExenta, 
						f_cuerpoDoc_ventaGravada, 
						f_cuerpoDoc_t_tributos, 
						f_cuerpoDoc_psv, 
						f_cuerpoDoc_noGravado, 

						resumen_totalNoSuj, 
						resumen_totalExenta, 
						resumen_totalGravada, 
						resumen_subTotalVentas, 
						resumen_descuNoSuj, 
						resumen_descuExenta, 
						resumen_descuGravada, 
						resumen_porcentajeDescuento, 
						resumen_totalDescu, 
						f_resumen_tributos_codigo, 
						f_resumen_tributos_descripcion, 
						f_resumen_tributos_valor, 
						resumen_subTotal, 
						resumen_ivaPerci1, 
						resumen_ivaRete1, 
						resumen_reteRenta, 
						resumen_montoTotalOperacion, 
						resumen_totalNoGravado, 
						resumen_totalPagar, 
						resumen_totalLetras, 
						resumen_saldoFavor, 
						resumen_condicionOperacion, 
						resumen_pagos, 
						resumen_numPagoElectronico, 
					
						sr_selloRecibido
					) VALUES ?
				`,
					[array_productos],
					(error, rows, fields) => {
						if (!error) {
							// Hacemos las rutas de ruta de origen y destino del archivo JSON.
							const rutaOrigen = path.join(ruta_carp_descargas, carpetaOrigen, fileName);
							const rutaDestino = path.join(ruta_carp_descargas, carpetaDestino, fileName);

							// Verificamos si el archivo existe.
							if (!fs.existsSync(rutaOrigen)) {
								return;
							}

							// Creamos la carpeta destino si no existe.
							if (!fs.existsSync(path.join(ruta_carp_descargas, carpetaDestino))) {
								fs.mkdirSync(path.join(ruta_carp_descargas, carpetaDestino), { recursive: true });
							}

							// Mueve el archivo
							fs.rename(rutaOrigen, rutaDestino, (err) => {
								if (!err) {
									// Si no existe error, devolvemos el mensaje.
									res.json({ mensaje: 'Compra guardada.' });
								}
							});
						} else {
							// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
							console.log(error);
						}
					}
				);
			}
		}
	);
});

// Ruta para listar los proveedores.
router.post('/list_proveedores', isLoggedIn, async (req, res) => {
	// Obtenemos el dato enviado por el usuario.
	let nombreProveedor = '%' + req.body.provName + '%';

	// Hacemos la consulta que nos devuelve el nombre de los proveedores.
	await pool.query(
		`SELECT DISTINCT emisor_nombre FROM fsp_compras_si WHERE emisor_nombre LIKE ? ORDER BY emisor_nombre ASC LIMIT 25`,
		[nombreProveedor],
		async (error, rows, fields) => {
			res.json(rows);
		}
	);
});

// Ruta para listar los proveedores.
router.post('/list_productos', isLoggedIn, async (req, res) => {
	// Obtenemos el dato enviado por el usuario.
	let nombreProducto = '%' + req.body.prodName + '%';

	// Hacemos la consulta que nos devuelve el nombre de los proveedores.
	await pool.query(
		`SELECT DISTINCT f_cuerpoDoc_descripcion FROM fsp_compras_si WHERE f_cuerpoDoc_descripcion LIKE ? ORDER BY f_cuerpoDoc_descripcion ASC LIMIT 25`,
		[nombreProducto],
		async (error, rows, fields) => {
			res.json(rows);
		}
	);
});

// Ruta para listar las compras guard
router.post('/list_compras_SI', isLoggedIn, async (req, res) => {
	let f_i = req.body.fecha_i;
	let f_f = req.body.fecha_f;
	let n_prov = '%' + req.body.nombre_proveedor + '%';
	let n_prod = '%' + req.body.nombre_producto + '%';

	// Hacemos una validación del código de generación de hacienda para que no se repita.
	await pool.query(
		`SELECT * FROM fsp_compras_si WHERE (ident_fecEmi BETWEEN ? AND ?) OR emisor_nombre LIKE ? OR f_cuerpoDoc_descripcion LIKE ?`,
		[f_i, f_f, n_prov, n_prod],
		async (error, rows, fields) => {
			res.json(rows);
		}
	);
});

/* -------------------------------------------------------------------------- */
/*                               EXPORTACIONES                                */
/* -------------------------------------------------------------------------- */
module.exports = router;
