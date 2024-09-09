//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
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
    let res1 = await prisma.user.findMany({
      where: {
        email: req.body.email,
      },
    });
    prisma.$disconnect();
    console.log(res1);
    if (
      res1.length > 0 &&
      res1[0]?.email === req.body.email &&
      res1[0]?.password === sha512(req.body.password)
    ) {
      res.status(200).json({ data: res1, status: "success", error: null });
    } else {
      if (res1.length > 0 && res1[0].email === req.body.email) {
        res
          .status(203)
          .json({ data: null, status: null, error: "Incorrect Password" });
      } else {
        res
          .status(203)
          .json({ data: null, status: null, error: "User not found" });
      }
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ data: null, status: null, error: "Internal Server Error" });
  }
}
