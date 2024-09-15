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
    const { id, password, ...otherValues } = req.body;
    console.log("request body -----",req.body);
    let res1 = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...otherValues,
        ...(password ? { password: sha512(password) } : {}),
      },
    });
    prisma.$disconnect();
    console.log("response body 1",res1);
    if (res1) {
      res.status(200).json({ data: res1, status: "success", error: null });
    } else {
      res
        .status(203)
        .json({ data: null, status: null, error: "Internal Server Error" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ data: null, status: null, error: "Internal Server Error" });
  }
}
