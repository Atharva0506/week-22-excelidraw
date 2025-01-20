import { CreateRoomScheam } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response) => {
  const parsedData = CreateRoomScheam.safeParse(req.body);
  if (!parsedData.success) {
    res.json({ error: "Invaild Inputs" }).status(411);
    return;
  }
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized: User ID is missing" });
    return;
  }
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data?.name ?? "",
        adminId: userId,
      },
    });
    res.status(201)
      .json({
        roomId: room.id,
      })
      
  } catch (error) {
    console.error("Error While Craeting RoomID", error);
    res.json({ error: "Internal Server Error" }).status(500);
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: Number(roomId),
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    res.json(messages).status(201);
  } catch (error: any) {
    console.error("Error While getting chats: " + error.message);
    res.json({ error: "error while getting message" }).status(501);
  }
};

export const getSlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    if (!slug) {
      res.status(400).json({ error: "Slug parameter is required." });
      return;
    }

    const room = await prismaClient.room.findFirst({
      where: { slug },
    });

    if (!room) {
      res.status(404).json({ error: `Room with slug "${slug}" not found.` });
      return;
    }

    res.status(200).json({ room });
  } catch (error) {
    console.error("Error fetching room:", error);

    res
      .status(500)
      .json({ error: "An error occurred while fetching the room." });
  }
};
