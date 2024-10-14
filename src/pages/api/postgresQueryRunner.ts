//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

type Data = {
  data: any;
  status: string | null;
  error: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const connectionString = req.body.connectionString;
    const sqlQuery = req.body.sqlQuery;

    if (!connectionString) {
      res
        .status(203)
        .json({ data: null, status: null, error: "Connection String missing" });
    }

    const pool = new Pool({
      connectionString,
    });

    try {
      // Connect and run the query
      const client = await pool.connect();
      const result = await client.query(sqlQuery);
      client.release();
      console.log(result.rows);

      res
        .status(200)
        .json({ data: result.rows, status: "success", error: null });
    } catch (error) {
        console.log(err);
      res
        .status(500)
        .json({ data: null, status: null, error: "Invalid Query / SQL Engine Error" });
    } finally {
      await pool.end();
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ data: null, status: null, error: "Internal Server Error" });
  }
}
