import jwt from "jsonwebtoken"
import { errorHandler } from "./error.js"

export const varifyToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        console.log("Token"+token)
        console.log("No token found");
        return next(errorHandler(401, "Unathoised!!!"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, "Forbidden"))
        req.user = user
        next();
    })
}
