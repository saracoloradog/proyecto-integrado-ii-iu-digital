import { createApp } from "./app.js";
import { getEnv } from "./config/env.js";
import { pool } from "./db/pool.js";

const env = getEnv();
const app = createApp(pool);
const server = app.listen(env.PORT, () => {
  console.log(`API disponible en http://localhost:${env.PORT}`);
});

async function shutdown(signal) {
  console.log(`${signal}: cerrando servidor`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

