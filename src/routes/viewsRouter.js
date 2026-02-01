import { Router } from "express";
const router = Router();

router.get("/login", async (req, res, next)=>{
    res.render("login.handlebars")
})

router.get("/profile", async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect("/login");
        }

        const { first_name, last_name, email } = req.session.user;
        res.render("profile", { first_name, last_name, email });
    } catch (error) {
        console.log("Error en profile:", error);
        res.redirect("/login");
    }
});

router.get("/reset-password", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.render("resetPassword", {
      error: "Token inválido o inexistente"
    });
  }

  res.render("resetPassword", { token });
});

export default router;