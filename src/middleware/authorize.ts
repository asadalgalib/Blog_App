import { NextFunction, Request, Response } from "express"
import { auth as betterAuth } from '../lib/auth';

// * Req User interface
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}
// * Type of roles
export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}
// * Middleware
const authorize = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // * get user session
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            })

            if (!session) {
                res.status(401).json({
                    success: false,
                    message: "You are not authorized"
                })
            }
            if (!session?.user.emailVerified) {
                res.status(403).json({
                    success: false,
                    message: "Your email is not verified"
                })
            }
            if (session) {
                req.user = {
                    id: session?.user.id,
                    email: session?.user.email,
                    name: session?.user.email,
                    role: session?.user.role as UserRole,
                    emailVerified: session?.user.emailVerified
                }
            }
            if (roles.length && !roles.includes(req.user?.role as UserRole)) {
                res.status(401).json({
                    success: false,
                    erro: "Forbidden",
                    message: "You are not authorized"
                })
            }
            next()
        } catch (error: any) {
            next(error);
        }
    }
}

export default authorize;