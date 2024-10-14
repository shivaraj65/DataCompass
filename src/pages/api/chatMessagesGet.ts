//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

type Data = {
  data: any;
  status: string | null;
  error: string | null;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log(req.body);    
    let chatMessages = await prisma.Message.findMany({
      where: {
        threadId: req.body.threadId,
        isDeleted:false
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (chatMessages && Array.isArray(chatMessages)) {
      res.status(203).json({ data: chatMessages, status: "success", error: null });
    } else {
      res
        .status(203)
        .json({ data: null, status: null, error: "DB Connection Error" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ data: null, status: null, error: "Internal Server Error" });
  }
}
