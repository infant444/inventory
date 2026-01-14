import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";


export class UserController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params["user-id"];
            const user = await prisma.user.findUnique({ where: { userId: userId } });
            res.json(user);
        } catch (e) {
            next(e);
        }
    }
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await prisma.user.findMany();
            res.json(users);
        } catch (e) {
            next(e);
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params["user-id"];
            const user = await prisma.user.update({ where: { userId: userId }, data: req.body });
            res.json(user);
        } catch (e) {
            next(e);
        }
    }
    static async updateUserEmailNotification(req: any, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const user = await prisma.user.update({ where: { userId: userId }, data: { emailNotification: req.body.status } });
            res.json(user);
        } catch (e) {
            next(e);
        }
    }
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userid;
            const user = await prisma.user.delete({ where: { userId: userId } });
            res.json(user);
        } catch (e) {
            next(e);

        }
    }
}