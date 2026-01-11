import { Router } from "express";
const router = Router();

router.get("/login", async (req, res, next)=>{
    res.render("login.handlebars")
})

router.get("/profile", async (req, res, next) => {
    try {
        // Validación de seguridad: si no hay usuario, mandarlo al login
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

export default router;