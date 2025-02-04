const allowedRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/auth/login');
        }
        const user = req.session.user;
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
            return res.status(403).render('pages/error', {
                title: "Forbidden",
                error: "You do not have access to this page.",
                code: 403,
            });
        }

        req.user = user;
        next();
    };
};

module.exports = { allowedRoles };
