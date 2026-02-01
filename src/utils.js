import { dirname } from "path"
import { fileURLToPath } from "url"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

export const serverRoot = dirname(fileURLToPath(import.meta.url));

export function createHash (password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export function isValidPassword(password, hashedPassword){
    return bcrypt.compareSync(password, hashedPassword)
}

export function generateToken(payload){
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })
}

export function verifyToken(token){
    return jwt.verify(token, process.env.JWT_SECRET)
}


