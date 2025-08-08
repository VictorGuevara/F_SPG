module.exports = {
    // Función para saber si se logueo correctamente.
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },

    // Función para saber si esta logueado.
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
    },

    // Función que valida al ciudad del usuario.
    authCiudad(ciudad) {
        return (req, res, next) => {
            if (req.user.ciudad_user !== ciudad) {
                return res.redirect('/logout');
            }
            
            return next();
        }
    }
}