const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn, authCiudad } = require("../lib/auth");
const pool = require("../database");
const helpers = require("../lib/helpers");

// Ruta para renderizar la vista de registro...
router.get("/admin/signup", isLoggedIn, (req, res) => {
	res.render("admin/signup");
});

// Ruta para realizar acciones al registrar usuarios...
router.post("/admin/regis_user", isLoggedIn, async (req, res, next) => {
	let noDui = req.body.user_dui;

	const newUserData = {
		username: req.body.user_name,
		password: req.body.user_pass,
		nombre_c: req.body.name_user,
		no_dui: req.body.user_dui,
		cargo: req.body.user_cargo,
		estado_cuenta: "Activo",
		sucursal_user: req.body.cdu_user,
	};

	newUserData.password = await helpers.encryptPassword(req.body.user_pass);
	await pool.query(
		"SELECT * FROM users WHERE no_dui = ?",
		[noDui],
		async (error, rows, fields) => {
			if (!error && rows.length > 0) {
				res.json({ mensaje: "Usuario registrado" });
			} else {
				const result = await pool.query(
					"INSERT INTO users SET ?",
					[newUserData],
					(error, rows, fields) => {
						if (!error) {
							// res.redirect('/admin/signup/');
							res.json({
								mensaje: "Usuario guardado con exito.",
							});
						} else {
							// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
							console.log(error);
							res.json({ mensaje: error });
						}
					},
				);
				newUserData.id = result.insertId;
			}
		},
	);
});

// Ruta para editar usuarios.
router.post("/admin/eUsers", isLoggedIn, async (req, res, next) => {
	let cod_user = req.body.cod_user;
	let nombre_c = req.body.nombre_c;
	let dui_user = req.body.dui_user;
	let cargo_us = req.body.cargo_us;
	let estadoCt = req.body.estadoCt;
	let ciudad_u = req.body.ciudad_u;

	await pool.query(
		"UPDATE users SET nombre_c = ?, no_dui = ?, cargo = ?, estado_cuenta = ?, sucursal_user = ? WHERE cod_users = ?",
		[nombre_c, dui_user, cargo_us, estadoCt, ciudad_u, cod_user],
		(error, rows, fields) => {
			if (!error) {
				// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
				res.json({ mensaje: "Usuario editado con exito." });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
				res.json({ mensaje: error });
			}
		},
	);
});

// Ruta para eliminar usuarios.
router.post("/admin/dUsers", isLoggedIn, async (req, res, next) => {
	let cod_user = req.body.cod_user;

	await pool.query(
		"DELETE FROM users WHERE cod_users = ?",
		[cod_user],
		(error, rows, fields) => {
			if (!error) {
				// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
				res.json({ mensaje: "Usuario eliminado con exito." });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
				res.json({ mensaje: error });
			}
		},
	);
});

// Ruta para renderizar la vista de registro...
router.get("/signin", isNotLoggedIn, (req, res) => {
	res.render("auth/signin");
});

// Ruta para realizar acciones al ingresar como usuario.
router.post("/signin", isNotLoggedIn, (req, res, next) => {
	passport.authenticate("local.signin", {
		successRedirect: "/directorie_used",
		failureRedirect: "/signin",
		failureFlash: true,
	})(req, res, next);
});

router.get("/directorie_used", isLoggedIn, (req, res) => {
	if (req.user.sucursal_user == "Santa Isabel") {
		res.redirect("/admin/");
	} else if (req.user.sucursal_user == "La Salud") {
		res.redirect("/asistente_de_admin/");
	}
});

// Ruta para renderizar la vista despues del registro...
router.get("/profile", isLoggedIn, authCiudad("sv"), (req, res) => {
	res.render("profile");
});

// Ruta para renderizar la vista despues del registro...
router.get("/profile_usa", isLoggedIn, authCiudad("usa"), (req, res) => {
	res.render("profile_usa");
});

// Ruta para cerrar la session.
router.get("/logout", isLoggedIn, (req, res, next) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/signin");
	});
});

module.exports = router;
