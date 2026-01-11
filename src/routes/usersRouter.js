import { json, Router } from "express";
import { userModel } from "../models/usersModels.js";
const router = Router();

router.get("/leer", async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});

router.use(json());

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
