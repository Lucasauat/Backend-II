import { json, Router, urlencoded } from "express";
import { userModel } from "../models/usersModels.js";
import { isValidPassword } from "../utils.js";
import passport, { Passport } from "passport";
const router = Router();

router.get("/failed-login", async(req, res, next)=>{
  res.status(400).json({message:"fallo el login"})
})

router.use(urlencoded({extended:true}))
router.use(json())

router.post("/register", async (req, res, next)=>{
  const user = req.body;
  try {
    const users = await userModel.create(user);
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});

// router.post("/login", async (req, res, next)=>{
//     const {email, password} = req.body
//     try {
//         const user = await userModel.findOne({email})
//        if(isValidPassword(password, user.password)){
//         req.session.user = user
//         res.status(200).redirect("/profile")
//        }else{
//         res.status(403).json({message:"fallo el login"})
//        }
//     } catch (error) {
//       console.log(error.message);
//     }
// });


router.post("/login", passport.authenticate("login", {failureRedirect:"failed-login"}), async (req, res, next)=>{
    res.status(200).json({message:"logeado exitosamente"})
});
export default router;