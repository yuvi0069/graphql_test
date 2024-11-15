import { Request, Response, NextFunction } from "express";
import { ENUM, MESSAGE } from "../helpers/constant.helper";
import {verify,JsonWebTokenError} from "jsonwebtoken";
import { getUserByUserId } from "../GraphQlApi/models/db";
import { ApiError } from "../errors/api";
import { error } from "console";
interface DecodedToken {
  userId: string;
}
interface RequestWithUser extends Request {
  user?: Object;
}
export const authorizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authAPIKey = process.env.AUTH_API_KEY;
  let apiKey = req.header("Api-Authorization");

  if (!apiKey) {
    return res
      .status(ENUM.HTTP_CODES.UNAUTHORIZED)
      .json({ error: MESSAGE.API_KEY_REQUIRED });
  }

  if (apiKey !== authAPIKey) {
    return res
      .status(ENUM.HTTP_CODES.UNAUTHORIZED)
      .json({ error: MESSAGE.INVALID_API_KEY });
  }

  if (apiKey === authAPIKey) {
    return next();
  }
};

// export const authorizationTokenMiddleware = (
//   isTokenRequired: boolean = true,
//   usersAllowed: string[] = []
// ) => {
//   return async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       //* Get token from request header and remove 'Bearer ' from it
//       let token = (
//         req.header("x-auth-token") || req.header("Authorization")
//       )?.replace(/Bearer\s+/g, "");

//       //* If token is required but not provided, return an error
//       if (isTokenRequired && !token) {
//         return res.status(400).json({ message: "Token is required." });
//       }

//       //* If no token is required, proceed to the next middleware
//       if (!isTokenRequired && !token) {
//         return next();
//       }

//       //* Verify token
//       let decoded: DecodedToken;
//       try {
//         decoded = verify(
//           token,
//           process.env.JWT_SECRET || "rent-payment"
//         ) as DecodedToken;
//       } catch (error) {
//         return res.status(401).json({ message: "Invalid token." });
//       }

//       //* Fetch user details using the userId from the decoded token
//       const user = await getUserByUserId(decoded.userId);
//       if (!user || !user.is_active) {
//         return res
//           .status(401)
//           .json({ message: "Unauthorized or inactive user." });
//       }

//       //* Check if user is allowed to access the route
//       if (
//         usersAllowed.length === 0 ||
//         usersAllowed.includes("*") ||
//         usersAllowed.includes(user.role_id)
//       ) {
//         //* Attach user details to the request object
//         req.user = {
//           userId: user.uuid,
//           role: user.role,
//           token,
//         };
//         return next();
//       } else {
//         return res.status(403).json({ message: "Access denied." });
//       }
//     } catch (error) {
//       return res.status(500).json({ message: "Internal Server Error", error });
//     }
//   };
// };
export const verifyToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  let token = (
    req.header("x-auth-token") || req.header("Authorization")
  )?.replace(/Bearer\s+/g, "");

  if (!token) {
    return res.status(403).json({
      code: 0,
      detail: "Access denied. No token provided.",
      status: "403",
    });
  }

  try {
    const decoded = verify(token, "rent-payment") as { userId: string };
    req.user = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({
        code: 0,
        detail: "Invalid token.",
        status: "401",
      });
    }

    return res.status(500).json({
      code: 0,
      detail: "An unexpected error occurred.",
      status: "500",
    });
  }
};
export const verifyUser = (resolver: any) => async (parent: any, args: any, context: any) => {
  const { req } = context;
  const  {userUuid}  = req.params;

 
    const userData = await getUserByUserId(userUuid);
    if (!userData.uuid) {
      throw new ApiError({
        code: 0,
        detail: `User not found`,
        status: "400",
      });
    }
    
    if (userData.uuid !== req.user) {
      throw new ApiError({
        code: 0,
        detail: "Access denied. You cannot update another user's details.",
        status: "403",
      });
    }

  
  return resolver(parent, args, context);
};

export const withVerifyToken = (resolver:any) => async (parent:any, args:any, context:any) => {
  const { req } = context; // Extract request from context

  let token = (
    req.header("xauthtoken") || req.header("Authorization")
  )?.replace(/Bearer\s+/g, "");

  if (!token) {
    throw new ApiError({
      code: 0,
      detail: "Access denied. No token provided.",
      status: "403",
    });
  }

  try {
    const decoded = verify(token, "rent-payment") as { userId: string };
    req.user = decoded.userId; // Attach userId to request object
  } catch (err) {
    throw new ApiError({
      code: 0,
      detail: "Invalid token.",
      status: "401",
    });
  }
  return resolver(parent, args, context);
};
// export const verifyUser = async (
//   req: RequestWithUser,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { userUuid } = req.params;
//     const userData = await getUserByUserId(userUuid);

//     if (!userData.uuid) {
//       throw new ApiError({
//         code: 0,
//         detail: User not found,
//         status: "400",
//       });
//     }
//     if (userData.uuid !== req.user) {
//       return res.status(403).json({
//         code: 0,
//         detail: "Access denied. You cannot update another user's details.",
//         status: "403",
//       });
//     }
//     next();
//   } catch (err) {
//     return res.status(500).json({
//       code: 0,
//       detail: "An unexpected error occurred.",
//       status: "500",
//     });
//   }
// };