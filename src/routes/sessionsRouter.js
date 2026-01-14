import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken"
import { PRIVATE_KEY } from "../utils/jwt.js";
import { createHash } from "../utils/bcrypt.js";
import { UserModel } from "../models/user.js";


const router = Router();


router.post("/login", (req, res, next) => {
    
    passport.authenticate("login", { session: false }, (err, user, info) => {
        if (err) return next(err); 

        if (!user) { return res.status(401).send({ 
                status: "error", 
                message: info && info.message ? info.message : "Usuario o contraseña incorrectos" 
            });
        }

        req.login(user, { session: false }, (err) => {
            if (err) res.send(err);
            
            const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
            res.cookie("coderCookie", token, { httpOnly: true }).send({ 
                status: "Completado", 
                message: "Login exitoso",
                payload: token 
            });
        });
    })(req, res, next);
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const user = await UserModel.create({
        first_name, last_name, email, age, 
        password: createHash(password)
    });
    res.send({ status: "Creado", message: "Usuario creado con exito" });
});

router.get( "/current", passport.authenticate("current", { session: false }), (req, res) => {
    res.send({status: "success", payload: req.user});
  }
);

export default router;
