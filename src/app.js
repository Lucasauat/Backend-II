import "./config/env.js";
dotenv.config();
import express from "express";
import { engine } from "express-handlebars";
import { mongoConnect } from "./database/mongoConnection.js";
import usersRouter from "./routes/usersRouter.js"
import cookieParser from "cookie-parser";
// import session from "express-session";
import fileStorage from "session-file-store"
// import MongoStore from "connect-mongo";
import sessionsRouter from "./routes/sessionsRouter.js"
import { serverRoot } from "./utils.js";
import viewsRouter from "./routes/viewsRouter.js"
import passport from "passport";
import { initializePassport } from "./config/passport.js";
import { generateToken, verifyToken } from "./utils.js";
import dotenv from "dotenv";
import productRouter from "./routes/productRouter.js";

 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', serverRoot + '/views');



initializePassport()
app.use(passport.initialize())

app.use("/api/users", usersRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/products", productRouter);

app.use("/", viewsRouter)


app.post("/session", async(req, res, next)=>{
    req.session.user = req.body
    res.json({mensaje:"sesion iniciada"})
})


app.get("/jwt-assign", async (req, res, next)=>{
    const user = {
    "email" : "test@test.com",
    "password" : "contraseña"
}
    res.cookie("jwt", generateToken(user)).json({mesagge:"cookie generada"})
})

app.listen(8080, ()=> {
  console.log("servidor activo en puerto 8080")
  mongoConnect().then(()=>console.log("base de datos conectada"))
});