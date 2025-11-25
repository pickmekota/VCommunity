// backend/db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const useDatabaseUrl = !!process.env.DATABASE_URL;

const pool = new Pool(
  useDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        // Heroku / production may need SSL true with rejectUnauthorized = false
        ssl:
          process.env.DB_SSL === "true"
            ? { rejectUnauthorized: process.env.DB_SSL_REJECT !== "false" }
            : false,
      }
    : {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "ugalec123",
        database: process.env.DB_NAME || "vcommunity",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        ssl: false,
      }
);

export { pool };
