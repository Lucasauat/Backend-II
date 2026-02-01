import { Router } from "express";
import passport from "passport";
import { authorize } from "../middlewares/authorization.js";

const router = Router();

router.post(
  "/",
  passport.authenticate("current", { session: false }),
  authorize(["admin"]),
  (req, res) => {
    res.json({ message: "Producto creado" });
  }
);

router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  authorize(["admin"]),
  (req, res) => {
    res.json({ message: "Producto actualizado" });
  }
);

router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  authorize(["admin"]),
  (req, res) => {
    res.json({ message: "Producto eliminado" });
  }
);

export default router;
