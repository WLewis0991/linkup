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

// Follow a user
router.post("/:id/follow", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params; // the user to follow
  const { userId } = req.user as CustomJwtPayload;

  if (id === userId) {
    return res.status(400).json({ message: "You cannot follow yourself!" });
  }

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: id,
      },
    });
    return res.status(201).json(follow);
  } catch (error) {
    return res.status(500).json({ message: "Error following user" });
  }
});

// Unfollow a user
router.delete("/:id/unfollow", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user as CustomJwtPayload;

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: id,
        },
      },
    });
    return res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error unfollowing user" });
  }
});

// Check if current user follows this user
router.get("/:id/status", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user as CustomJwtPayload;

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: id,
        },
      },
    });
    return res.json({ isFollowing: !!follow });
  } catch (error) {
    return res.status(500).json({ message: "Error checking follow status" });
  }
});

export default router