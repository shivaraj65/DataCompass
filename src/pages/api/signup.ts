//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { sha512 } from "js-sha512";

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
    //check for existing users
    let test = await prisma.user.findMany({
      where: {
        email: req.body?.email,
      },
      orderBy: {
        name: "desc",
      },
    });
    if (test.length > 0) {
      prisma.$disconnect();
      res
        .status(203)
        .json({ data: null, status: null, error: "User Already Exist" });
    } else {
      let res1 = await prisma.user.create({
        data: {
          id: uuidv4(),
          name: req.body?.name,
          email: req.body?.email,
          password: sha512(req.body?.password),
          isEditable: {
            id: false,
            name: true,
            email: false,
            password: true,
            llmApiKeys: true,
            databases: true,
            rag: true,
          },
          createdAt: new Date().toISOString(),
          authOrigin: "website",
          llmApiKeys: {},
          databases: {},
          accountStatus: true,
          rag: {},
        },
      });
      prisma.$disconnect();
      res.status(200).json({ data: res1, status: "success", error: null });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ data: null, status: null, error: "Internal Server Error" });
  }
}
