import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { mongoConnect } from "./database/mongoConnection.js";
import initializePassport from "./config/passport.js";
import sessionsRouter from "./routes/sessionsRouter.js";

const app = express();
const PORT = 8080;

// conexion a db
mongoConnect();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//passport
initializePassport();
app.use(passport.initialize());


app.use("/api/sessions", sessionsRouter);

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));