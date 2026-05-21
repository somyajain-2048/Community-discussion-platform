// import { Request,Response } from "express";

// import {createUser} from "./auth.service";
// import { loginUserService } from "./auth.service";

// export const registerUser = async(
//     req:Request,
// res:Response
// ) => {
//     try {
//         if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
//           res.status(400).json({ success: false, message: "username, email, and password are required" });
//           return;
//         }
//         const result = await createUser(req.body);
//         res.status(201).json({
//           success: true,
//           message: "User registered successfully",
//           data: result,
//         });
//     } catch (error: any) {
//       console.log("error: ", error);
//       const isClientError =
//         error.message === "Email already in use" ||
//         error.message === "Username already taken";
//       res.status(isClientError ? 409 : 500).json({
//         success: false,
//         message: isClientError ? error.message : "Something went wrong",
//       });
//     }
// }

// export const loginUser = async(
//   req:Request,
//   res:Response
// )=>{
//   try {
//     const result = await loginUserService(req.body);

//     res.status(200).json({
//       success:true,
//       message:"login successfull",
//       token:result,

//     });
//   } catch (error:any) {
//     res.status(400).json({
//       success:false,
//       message:error.message
//     })
//   }
// }

// export const getMe = async(
//   req:Request,
//   res:Response
// )=>{
//   const user = (req as any).user;

//   res.status(200).json({
//     success:true,
//     data:user
//   })
// }

import { Request, Response } from "express";

import { createUser, loginUserService } from "./auth.service";

import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../utils/token";

// ======================
// REGISTER
// ======================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "username, email, and password are required",
      });
    }

    const result = await createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    const isClientError =
      error.message === "Email already in use" ||
      error.message === "Username already taken";

    res.status(isClientError ? 409 : 500).json({
      success: false,
      message: isClientError ? error.message : "Something went wrong",
    });
  }
};

// ======================
// LOGIN
// ======================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await loginUserService(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result, // ✅ FIXED
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// REFRESH TOKEN
// ======================
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as any;

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

// ======================
// GET ME
// ======================
export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;

  res.status(200).json({
    success: true,
    data: user,
  });
};