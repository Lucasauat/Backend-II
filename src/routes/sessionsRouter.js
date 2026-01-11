import { json, Router, urlencoded } from "express";
import { userModel } from "../models/usersModels.js";
const router = Router();

router.use(urlencoded({extended:true}))

router.post("/register", async (req, res, next)=>{
  const user = req.body;
  try {
    const users = await userModel.create(user);
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", async (req, res, next)=>{
    const {email, password} = req.body
    try {
        if(req.session.user){
          console.log("Login exitoso para:", email)
           return res.redirect("/profile")
        }
        const user = await userModel.findOne({email, password})
        if(user){
            req.session.user = user
            return res.redirect("/profile")
        }
    } catch (error) {
      console.log(error.message);
        return res.status(401).render("login", { error: "Credenciales inválidas" })
    }
});

export default router;