const User = require("../models/user.js");

const showLogin = (req, res) => {
  return res.render("pages/login", {
    title: "Login",
  });
};

const login = async (req, res) => {
  const { login, password } = req.body;
  const errors = {};

  if (!login) {
    errors.login = "Login is required.";
  }
  if (!password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.render("pages/login", {
      title: "Login - Error",
      errors,
      patient: { login },
    });
  }

  try {
    const user = await User.findOne({ login });

    if (!user) {
      return res.render("pages/login", {
        title: "Login - Error",
        errors: { login: "Incorrect login credentials." },
        patient: { login },
      });
    }

    if (user.password !== password) {
      return res.render("pages/login", {
        title: "Login - Error",
        errors: { password: "Incorrect password." },
        patient: { login },
      });
    }

    req.session.user = { login: user.login, rol: user.rol, id: user._id };
    console.log(req.session.user);
    return res.redirect("/");
  } catch (err) {
    res.status(500).render("pages/error", {
      title: "Error",
      error: "An error occurred while processing your login.",
      code: 500,
    });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

module.exports = {
  showLogin,
  login,
  logout
};
