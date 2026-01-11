import { Router } from "express";
const router = Router();

router.get("/login", async (req, res, next)=>{
    res.render("login.handlebars")
})

router.get("/profile", async (req, resizeBy, next)=>{
    const {first_name, last_name, email} = req.session.user
    res.render("profile.handlebars", {
        first_name, last_name, email
    })
})

export default router;