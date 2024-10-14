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

    if (!connectionString) {
      res
        .status(203)
        .json({ data: null, status: null, error: "Connection String missing" });
    }

    const pool = new Pool({
      connectionString,
    });

    try {
      const result = await pool.query(`
          SELECT table_name, column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'public'
          ORDER BY table_name, ordinal_position;
        `);

      const tables = {};

      // Structure the data for easier access
      result.rows.forEach((row) => {
        const { table_name, column_name, data_type } = row;
        if (!tables[table_name]) {
          tables[table_name] = [];
        }
        tables[table_name].push({ column_name, data_type });
      });

      res.status(200).json({ data: tables, status: "success", error: null });
    } catch (error) {
      console.error("Error fetching tables:", error);
      res
        .status(500)
        .json({ data: null, status: null, error: "Internal Server Error" });
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
