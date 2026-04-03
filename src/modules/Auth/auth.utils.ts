import jwt, { JwtPayload } from 'jsonwebtoken'

type TJwtPayload = {
    userId: string;
    role: string;
    email: string;
    name: string;
}

export const createToken = (jwtPayload: TJwtPayload, secret: string, expiresIn: string) => {
    return jwt.sign(jwtPayload, secret, { expiresIn })
}

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as JwtPayload
}