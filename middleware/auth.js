// authenticationMiddleware.js
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

// const authenticationMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   console.log(req.headers)
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     throw next(new UnauthenticatedError('No token provided'));
//   }

//   const token = authHeader.split(' ')[1];
//   console.log(token)
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { id, username } = decoded;
//     req.user = { id, username };
//     next();
//   } catch (error) {
//     throw next(new UnauthenticatedError('Not authorized to access this route'));
//   }
// };

const authenticationMiddleware = (req, res, next) => {
    console.log("내가 만든 쿠키: ");
    console.log(req.headers.cookie);
    const cookies = req.headers.cookie;

    if (!cookies) {
        throw next(new UnauthenticatedError("No cookies provided"));
    }

    const tokenCookie = cookies
        .split(";")
        .find((cookie) => cookie.trim().startsWith("jwtToken="));

    if (!tokenCookie) {
        throw next(new UnauthenticatedError("No token cookie provided"));
    }

    const token = tokenCookie.split("=")[1];

    if (!token) {
        throw next(new UnauthenticatedError("No token provided"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, username } = decoded;
        req.user = { id, username };
        next();
    } catch (error) {
        throw next(
            new UnauthenticatedError("Not authorized to access this route")
        );
    }
};

export default authenticationMiddleware;
