import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserType } from "../model/user.model";
import { prisma } from "../lib/prisma";

export class AuthController {

  // ✅ CREATE USER
  static async CreateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { full_name, email, phone, password, role, location_ids } = req.body;
      console.log(email)
      if (!full_name || !email || !password) {
        return next({ status: 400, message: "Required fields missing" });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return next({ status: 409, message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          fullName: full_name,
          email,
          phone: phone ?? null,
          password: hashedPassword,
          role: role ?? 'staff',
          locationIds: location_ids ?? []
        },
        select: {
          userId: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          emailNotification: true,
          locationIds: true,
          createdAt: true
        }
      });

      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }

  // 🔐 LOGIN
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next({ status: 400, message: "Email and password required" });
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return next({ status: 404, message: "User does not exist" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return next({ status: 401, message: "Password mismatch" });
      }

      const updatedUser = await prisma.user.update({
        where: { userId: user.userId },
        data: { isActive: true }
      });

      const userData: User = {
        user_id: updatedUser.userId,
        full_name: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone ?? "",
        password: updatedUser.password,
        role: updatedUser.role,
        is_active: updatedUser.isActive,
        email_notification: updatedUser.emailNotification,
        location_ids: updatedUser.locationIds
      };

      res.json(generateUserToken(userData));
    } catch (error) {
      next(error);
    }
  }

  // 🔁 UPDATE PASSWORD
  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, password, new_password } = req.body;

      if (!user_id || !password || !new_password) {
        return next({ status: 400, message: "Missing fields" });
      }

      const user = await prisma.user.findUnique({ where: { userId: user_id } });

      if (!user) {
        return next({ status: 404, message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return next({ status: 401, message: "Old password mismatch" });
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);

      await prisma.user.update({
        where: { userId: user_id },
        data: { password: hashedPassword }
      });

      res.json({ status: 200, message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  // 🚪 LOGOUT
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.user_id;

      await prisma.user.update({
        where: { userId },
        data: { isActive: false }
      });

      res.json({ status: 200, message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }
}

// 🔐 TOKEN GENERATOR
const generateUserToken = (user: User) => {
  if (!process.env.JWT_USER_AUTH) {
    throw new Error("JWT_USER_AUTH not configured");
  }

  const token = jwt.sign(
    { id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_USER_AUTH,
    { expiresIn: "7d" }
  );

  return {
    user_id: user.user_id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    is_active: user.is_active,
    email_notification: user.email_notification,
    location_ids: user.location_ids,
    token
  };
};
