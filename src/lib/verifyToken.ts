// JWT verification helper

import jwt from "jsonwebtoken";


export function verifyToken(token?: string) {
    if(!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded as { userId: string };    
    } 
    catch (error) {
        return null;
    }
}