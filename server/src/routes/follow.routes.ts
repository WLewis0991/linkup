import express, {Response, Request} from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { CustomJwtPayload } from "../types/auth.types";
import prisma from "../config/db";

const router= express.Router();

//Get any users followers
router.get("/:id/followers", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: id },
      include: { follower: true }
    })
    return res.json(followers)
  } catch (error) {
    return res.status(500).json({ message: "Error fetching who user followers" })
  }
});

//Get who user is following
router.get("/:id/following", authMiddleware, async (req: Request<{id: string}>, res: Response) => {
    const { id } = req.params;

    try{
        const following = await prisma.follow.findMany({
          where: {followerId : id },
          include: { following: true }
        })
        return res.json(following)
    } catch(error) {
        return res.status(500).json({message : "Error fetching who users following"})
    }
})