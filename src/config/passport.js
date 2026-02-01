import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { userModel } from "../models/usersModels.js";
import { createHash, isValidPassword } from "../utils.js";
import { authorize } from "../middlewares/authorization.js";

export function initializePassport() {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (req, username, password, done) => {
        try {
          password = createHash(password);
          const newUser = await userModel.create({ ...req.body, password });
          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            if (isValidPassword(password, user.password)) {
              done(null, user);
            } else {
              done(null, false);
            }
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
