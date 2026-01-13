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
const hash = createHash("luquitas")

export function generateToken(payload){
    return jwt.sign(payload, "elsecretodekratos")
}

export function verifyToken(token){
    return jwt.verify(token, "elsecretodekratos")
}
const token = generateToken({nombre:"lucas"})

console.log(verifyToken(token))
// console.log(isValidPassword("luquitas", hash))