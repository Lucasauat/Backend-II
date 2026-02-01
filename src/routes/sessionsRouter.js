import { json, Router, urlencoded } from "express";
import { userModel } from "../models/usersModels.js";
import { isValidPassword } from "../utils.js";
import passport, { Passport } from "passport";
import { generateToken } from "../utils.js";
import CurrentUserDTO from "../dto/currentUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { transporter } from "../config/mailer.js";

const router = Router();

router.get("/failed-login", async (req, res, next) => {
  res.status(400).json({ message: "fallo el login" });
});

router.use(urlencoded({ extended: true }));
router.use(json());

router.post("/register", async (req, res, next) => {
  try {
    const users = await userModel.create({
      ...req.body,
      role: "user",
    });
    res.status(201).json({
      message: "Usuario registrado correctamente",
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "failed-login",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;

    const token = generateToken({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });

    res.json({ token });
  }
);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const userDTO = new CurrentUserDTO(req.user);
    res.json(userDTO);
  }
);

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const token = jwt.sign(
    { email: user.email },
    process.env.RESET_PASSWORD_SECRET,
    { expiresIn: "1h" }
  );

  const resetLink = `http://localhost:8080/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Soporte Ecommerce" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Recuperación de contraseña",
   html: `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:500px; margin:auto; background:#fff; padding:25px; border-radius:8px;">
      
      <h2 style="text-align:center;">Recuperación de contraseña</h2>

      <p>Recibimos una solicitud para restablecer tu contraseña.</p>

      <p style="text-align:center; margin:30px 0;">
        <a href="${resetLink}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#000;
            color:#fff;
            text-decoration:none;
            border-radius:5px;
            font-weight:bold;
          ">
          Restablecer contraseña
        </a>
      </p>

      <p>Si el botón no funciona, copiá y pegá este link en tu navegador:</p>

      <p style="word-break:break-all; background:#eee; padding:10px; border-radius:5px;">
        ${resetLink}
      </p>

      <p style="font-size:12px; color:#666;">
        Este enlace vence en 1 hora.
      </p>
    </div>
  </div>
`

  });

  res.json({ message: "Correo de recuperación enviado" });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (bcrypt.compareSync(password, user.password)) {
      return res
        .status(400)
        .json({ error: "No podés usar la misma contraseña" });
    }

    user.password = bcrypt.hashSync(password, 10);
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Token inválido o expirado" });
  }
});

export default router;
