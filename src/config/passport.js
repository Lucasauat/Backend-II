import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { UserModel } from "../models/user.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { PRIVATE_KEY } from "../utils/jwt.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookie'];
    }
    return token;
};

const initializePassport = () => {
    
    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user) return done(null, false, { message: "Usuario no encontrado" });
                if (!isValidPassword(user, password)) return done(null, false, { message: "Clave o Email inválidos" });
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));


passport.use("current", new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor, ExtractJWT.fromAuthHeaderAsBearerToken()]),
            secretOrKey: PRIVATE_KEY
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload.user);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

export default initializePassport;
