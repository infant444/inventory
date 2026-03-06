import { verify ,TokenExpiredError} from "jsonwebtoken";
import { AuthUser } from "../model/auth.model";


export default (req: any, res: any, next: any) => {
    // console.log("Auth middleware called for:", req.method, req.path);
    const token = req.headers.access_token as string;
    // console.log("Token present:", !!token);
    
    if (!token) {
        // console.log("No token provided");
        return res.status(401).json({
            success: false,
            message: "Token missing. Please login."
        });
    }

    try {
        // console.log("Verifying token...");
        const decoderedUser = verify(token, process.env.JWT_USER_AUTH!) as AuthUser;
        req.user = decoderedUser;
        // console.log("Token verified successfully for user:", decoderedUser.id);
    } catch (error) {
        console.log("Auth error:", error);
        if (error instanceof TokenExpiredError) {
            console.log("Token Expired");
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }
        console.log("Invalid Token");
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
    return next();
}