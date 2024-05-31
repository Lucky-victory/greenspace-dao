import { connectionUri } from "src/db";
import type { Config } from "drizzle-kit";
export default {
  out: "./src/drizzle",
  schema: "./src/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: connectionUri || "",
  },
} satisfies Config;
