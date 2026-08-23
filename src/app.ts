import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./modules";
import healthRoutes from "./modules/health/health.routes";
import checkInRoutes from "./modules/check-in/check-in.routes";

import { notFound } from "./common/middleware/not-found";
import { errorHandler } from "./common/errors/error-handler";
import checkInApiRoutes from "./modules/check-in/check-in.api.routes";

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || "*";

app.use(helmet());

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(compression());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

app.use("/health", healthRoutes);

app.use("/api", routes);

app.use("/check-in", checkInRoutes);
app.use("/api/check-in", checkInApiRoutes); // JSON lookup

app.use(notFound);

app.use(errorHandler);

export default app;
