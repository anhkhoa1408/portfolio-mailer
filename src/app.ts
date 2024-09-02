import express, { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import router from "./routes/v1";
import { ErrorResponse, NotFoundError } from "./core/error.response";
import { rateLimit } from "express-rate-limit";

// init app
configDotenv();
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  message: "Too many request",
});
app.use(limiter);

// init routes
app.use("/api/v1", router);

app.get("/", (req, res, next) => {
  return res.send("Welcome to Portfolio mailer");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError({});
  next(error);
});

// error catching
app.use((err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = err?.statusCode || 500;
  return res.status(500).json({
    code: errorStatus,
    message: err?.message || "Internal server error",
  });
});

export default app;
