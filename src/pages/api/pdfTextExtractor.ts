//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Readable } from "stream";
import { PDFDocument } from "pdf-lib";

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
    // console.log(req.body.data);

    const { data: pdfData } = req.body;

    if (!pdfData) {
      return res.status(400).json({
        data: null,
        status: null,
        error: "Base64 PDF data is required",
      });
    }

    const pdfBase64 = await pdfData.split(",")[1];
    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });
    const loader = new PDFLoader(pdfBlob);
    const documents = await loader.load();

    const textContent = documents.map((doc) => doc.pageContent).join("\n");

    // console.log(textContent);

    res.status(200).json({ data: textContent, status: "success", error: null });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ data: null, status: null, error: "Internal Server Error" });
  }
}
