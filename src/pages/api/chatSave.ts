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
    //check for threadID. if null create a thread and the proceed for question and answer save.
    if (!req.body.threadID) {
      const newThreadId = await uuidv4();
      let res1 = await prisma.thread.create({
        data: {
          id: newThreadId,
          userId: req.body.userId,
          title: req.body.title,
          chatType: req.body.chatType,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          ...(req.body.databaseConnection && {
            databaseConnection: req.body.databaseConnection,
          }),
          ...(req.body.ragType && {
            ragType: req.body.ragType,
          }),
          ...(req.body.externalRag && {
            externalRag: req.body.externalRag,
          }),
        },
      });

      let res2 = await prisma.message.create({
        data: {
          id: await uuidv4(),
          threadId: newThreadId,
          role: "user",
          context: req.body.question,
          metrics: req.body.metrics,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        },
      });

      let res3 = await prisma.message.create({
        data: {
          id: await uuidv4(),
          threadId: newThreadId,
          role: "assistant",
          context: req.body.answer,
          metrics: req.body.metrics,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        },
      });
      prisma.$disconnect();
      if (res1 && res2 && res3) {
        res.status(200).json({
          data: {
            thread: res1,
            chatMessages: [res2, res3],
          },
          status: "success",
          error: null,
        });
      } else {
        res
          .status(203)
          .json({ data: null, status: null, error: "DB Connection Error" });
      }
    } else {
      let res2 = await prisma.message.create({
        data: {
          id: await uuidv4(),
          threadId: req.body.threadID,
          role: "user",
          context: req.body.question,
          metrics: req.body.metrics,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        },
      });
      let res3 = await prisma.message.create({
        data: {
          id: await uuidv4(),
          threadId: req.body.threadID,
          role: "assistant",
          context: req.body.answer,
          metrics: req.body.metrics,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        },
      });
      prisma.$disconnect();
      if (res2 && res3) {
        res.status(200).json({
          data: {
            chatMessages: [res2, res3],
          },
          status: "success",
          error: null,
        });
      } else {
        res
          .status(203)
          .json({ data: null, status: null, error: "DB Connection Error" });
      }
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ data: null, status: null, error: "Internal Server Error" });
  }
}
