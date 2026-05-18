import express, { Request, Response } from "express";
import prisma from "../config/db";
import { authMiddleware } from "../middleware/authMiddleware";
import { CustomJwtPayload } from "../types/auth.types";

const router = express.Router();

interface CreateRoomRequest {
  name: string;
  description?: string;
}
//Cerate new room
router.post(
  "/create",
  async (req: Request<{}, {}, CreateRoomRequest>, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Room name is required" });
    }
    try {
      const existingRoom = await prisma.room.findUnique({
        where: { name },
      });
      if (existingRoom) {
        return res.status(409).json({ message: "Room name already exists" });
      }
      await prisma.room.create({
        data: {
          name,
          description,
        },
      });
      return res.status(201).json({ message: "Room created successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error creating room" });
    }
  },
);

//Get users rooms
router.get("/my-rooms", authMiddleware, async (req: Request, res: Response) => {
  const { userId } = req.user as CustomJwtPayload;

  try {
    const rooms = await prisma.roomMember.findMany({
      where: { userId },
      include: { room: true },
    });
    const userRooms = rooms.map((membership) => membership.room);
    return res.json(userRooms);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user's rooms" });
  }
});

// Get all rooms
router.get("/all", authMiddleware, async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany();
    return res.json(rooms);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching rooms" });
  }
});

//Become a room member
router.post(
  `/:roomName/join`,
  authMiddleware,
  async (
    req: Request<{ roomName: string }, { userId: string }>,
    res: Response,
  ) => {
    const { roomName } = req.params;
    const { userId } = req.user as CustomJwtPayload;

    try {
      const room = await prisma.room.findUnique({
        where: { name: roomName },
      });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      await prisma.roomMember.create({
        data: {
          userId,
          roomId: room.id,
        },
      });

      return res.status(200).json({ message: "Successfully joined the room" });
    } catch (error) {
      return res.status(500).json({ message: "Error joining the room" });
    }
  },
);

export default router;
