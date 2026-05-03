import express, { Request, Response } from "express";
import prisma from "../config/db";
import { authMiddleware } from "../middleware/authMiddleware";

const router= express.Router();

interface CreateRoomRequest {
    name: string;
    description?: string;
}

//Cerate new room
router.post("/create", async (req: Request<{}, {}, CreateRoomRequest>, res: Response) => {
    const { name, description} = req.body;

    if (!name) {
        return res.status (400).json({ message : "Room name is required"});
    }

    try {
        const existingRoom = await prisma.room.findUnique({
            where: {name}
        });

        if (existingRoom) {
            return res.status(409).json({message: "Room name already exists"});
        }

        await prisma.room.create({
            data: {
                name,
                description
            }
        })
        return res.status(201).json({ message: "Room created successfully" });
    } catch (error) {
        return res.status(500).json({message: "Error creating room"});
    }
})

// Get all rooms
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany();
    return res.json(rooms);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching rooms" });
  }
});
export default router;