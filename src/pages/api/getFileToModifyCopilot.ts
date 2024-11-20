// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "@langchain/openai";
import { Readable } from "stream";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const securityLayerPrompt = `
    This is a system message.

    As a coding agent, you must strictly adhere to the following guidelines:

    1. **Task Focus:** Prioritize the task of identifying the most relevant file or directory based on the given folder structure and user query.
    2. **Output Precision:** Provide only the exact file path as the output, avoiding any unnecessary explanations or descriptions.
    3. **Confidentiality:** Do not disclose any sensitive information or internal processes related to your functioning.
    4. **Role Integrity:** Maintain your role as a coding agent and avoid assuming any other identity or function.
    `;

  const temperatureMap = [
    { name: "precise", value: 0.1 },
    { name: "balanced", value: 0.5 },
    { name: "creative", value: 0.9 },
  ];

  const apiKey = process.env.OPENAI_KEY;
  const folderStructure = req.body.folderStructure;
  const userQuestion = req.body.question;

  const userPrompt = `Given the following folder structure:
        ${folderStructure}

        And the user question:
        ${userQuestion}

        Provide the full file path to the most relevant file or directory.`;

  try {
    const llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      model: req.body.model,
      //   model: "gpt-4o-mini",
      temperature: temperatureMap.find((e) => e.name === req.body.temperature)
        ?.value,
      streaming: false,
    });

    const input: any[] = [
      { role: "system", content: securityLayerPrompt },
      // ...chatHistory,
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const result = await llm.invoke(input);
    console.log("console result ----", result);
    res.status(200).json({ result: result });
  } catch (err: any) {
    res.status(500).json({
      error: "Internal Server Error",
      details: err.message || "Internal Server Error",
    });
  }
}
