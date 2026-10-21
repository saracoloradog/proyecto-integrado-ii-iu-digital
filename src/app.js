import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { getEnv } from "./config/env.js";
import { catalogs } from "./modules/catalog-config.js";
import { createCrudRouter } from "./modules/crud-router.js";
import { createMediaRouter } from "./modules/media-router.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";

export function createApp(db, envOverrides = {}) {
  const env = getEnv({ ...process.env, ...envOverrides });
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) }));
  app.use(express.json({ limit: "100kb" }));
  if (env.NODE_ENV !== "test") app.use(morgan("combined"));

  app.get("/api/health", (req, res, next) => {
    Promise.resolve(db.query("select 1 as ok"))
      .then(() => res.json({ status: "ok" }))
      .catch(next);
  });

  for (const [path, config] of Object.entries(catalogs)) {
    app.use(`/api/${path}`, createCrudRouter(db, config));
  }
  app.use("/api/media", createMediaRouter(db));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

