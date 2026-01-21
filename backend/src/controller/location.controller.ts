
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export class LocationController {
    // Create User Location
    static async createLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                locationCode,
                locationName,
                address,
                city,
                state,
                country,
            } = req.body;

            const location = await prisma.location.create({
                data: {
                    locationCode: locationCode,
                    locationName: locationName,
                    address: address,
                    city: city,
                    state: state,
                    country: country,
                }

            })
            res.status(200).json(location)
        } catch (err) {
            next(err)
        }
    }
    // Get All Location
    static async getAllLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const locations = await prisma.location.findMany();
            res.status(200).json(locations)
        } catch (err) {
            next(err)
        }
    }
    // Get Particular Location
    static async getLocationById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.locationId
            const location = await prisma.location.findUnique({
                where: {
                    locationId: id
                }
            })
            res.status(200).json(location)
        } catch (err) {
            next(err)
        }
    }
    // Update Location
    static async updateLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.locationId
            const {
                locationCode,
                locationName,
                address,
                city,
                state,
                country,
            } = req.body;
            const location = await prisma.location.update({
                where: {
                    locationId: id
                },
                data: {
                    locationCode: locationCode,
                    locationName: locationName,
                    address: address,
                    city: city,
                    state: state,
                    country: country,
                }
            })
            res.status(200).json(location)
        } catch (err) {
            next(err)
        }
    }
    // Delete a location
    static async deleteLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.locationId
            const location = await prisma.location.delete({
                where: {
                    locationId: id
                }
            })
            res.status(200).json(location)
        } catch (err) {
            next(err)
        }
    }
    // Assign a location to user
    static async assignLocation(req: any, res: Response, next: NextFunction) {
        try {
            const { locationId } = req.body;
            const userId = req.user.id;
            
            // Extract locationId if it's an object
            const actualLocationId = typeof locationId === 'object' ? locationId.locationId : locationId;
            
            const user = await prisma.userLocation.findFirst({
                where: {
                    userId: userId
                }
            });
            if (user) {
                const UserLocation = await prisma.userLocation.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        locationId: actualLocationId
                    }
                })
                res.status(200).json(UserLocation)
                return;
            }
            const userLocation = await prisma.userLocation.create({
                data: {
                    locationId: actualLocationId,
                    userId: userId,
                }

            })
            res.status(200).json(userLocation);
        } catch (err) {
            next(err)
        }
    }
    static async getUserLocation(req: any, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id
            const user = await prisma.user.findUnique({
                where: { userId },
                select: { locationIds: true },
            });

            if (!user || user.locationIds.length === 0) {
                 res.status(404).json({ message: "No locations found for user" });
                 return;
            }
            const userLocation = await prisma.location.findMany({
                where: {
                    locationId: {
                        in: user?.locationIds
                    }
                },

            })
            res.status(200).json(userLocation)
        } catch (err) {
            next(err)
        }
    }
    static async getUserLocationById(req: any, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id
            const userLocation = await prisma.userLocation.findFirst({
                where: {
                    userId: userId,
                },
                include: {
                    location: true,
                },
            });
            res.status(200).json(userLocation)
        } catch (err) {
            next(err)
        }
    }

}