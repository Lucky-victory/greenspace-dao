import { connectionUri } from "@/db";
import type { Config } from "drizzle-kit";
export default {
  out: "./drizzle",
  schema: "./db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: connectionUri || "",
  },
} satisfies Config;
