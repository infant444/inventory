import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class categoriesController {
    static async createCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const { typeName, description } = req.body
            const categories = await prisma.typeMaster.create({
                data: {
                    typeName: typeName,
                    description: description
                }
            })
            res.json(categories)
        } catch (error) {
            next(error)
        }
    }
    static async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await prisma.typeMaster.findMany()
            res.json(categories)
        } catch (error) {
            next(error)
        }
    }
    static async getCategoriesById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.categoriesId
            const categories = await prisma.typeMaster.findUnique({
                where: {
                    typeId: id
                }
            });
            res.json(categories);
        } catch (error) {
            next(error)
        }
    }
    static async updateCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.categoriesId
            const { typeName, description } = req.body
            const categories = await prisma.typeMaster.update({
                where: {
                    typeId: id
                },
                data: {
                    typeName: typeName,
                    description: description
                }
            })
            res.json(categories)
        } catch (error) {
            next(error)
        }
    }
    static async deleteCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.categoriesId
            const categories = await prisma.typeMaster.delete({
                where: {
                    typeId: id
                }
            })
            res.json(categories)
        } catch (error) {
            next(error)
        }
    }
}