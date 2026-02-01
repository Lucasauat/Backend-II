import { json, Router, urlencoded } from "express";
import { userModel } from "../models/usersModels.js";
import { createHash } from "../utils.js";
import passport from "passport";

const router = Router();

router.get("/leer", async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});

router.get('/failure-register', async (req, res, next)=>{
  res.status(400).json({message: "registro fallido"})
})

router.use(json());
router.use(urlencoded({extended:true}))

router.post('/register',
  passport.authenticate("register", {failureRedirect: "/failure-register"}),
   async (req, res, next)=>{
  res.status(200).json({message:"registro exitoso"})
})


router.post("/crear", async (req, res, next) => {
  const user = req.body;
  try {
    const users = await userModel.create(user);
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/actualizar", async (req, res, next) => {
  const { email, first_name } = req.body;
  try {
    const users = await userModel.findOneAndUpdate({ email }, { first_name });
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});

router.delete("/borrar", async (req, res, next) => {
  const { email } = req.body;
  try {
    const users = await userModel.findOneAndDelete({ email });
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});
export default router;
