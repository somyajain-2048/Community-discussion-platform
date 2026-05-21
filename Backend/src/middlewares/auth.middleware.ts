import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const optionalAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
      (req as any).user = { id: decoded.id, role: decoded.role };
    }
  } catch {}
  next();
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    // ======================
    // CHECK HEADER
    // ======================
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    // ======================
    // EXTRACT TOKEN
    // ======================
    const token = authHeader.split(" ")[1];

    // ======================
    // VERIFY TOKEN
    // ======================
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    // attach user
    (req as any).user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    // ======================
    // HANDLE TOKEN ERRORS
    // ======================
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
