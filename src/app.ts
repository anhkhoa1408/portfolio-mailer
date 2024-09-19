import compression from "compression";
import cors, { CorsOptions, CorsOptionsDelegate } from "cors";
import { configDotenv } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { ErrorResponse, NotFoundError } from "./core/error.response";
import router from "./routes/v1";
import { HEADERS } from "./auth/authUtils";

// init app
configDotenv();
const app = express();

// cors for domain from my portfolio
const allowedOrigins = process.env.ALLOW_ORIGINS?.split(",") || [];
const corsOptions: CorsOptions = {
  // origin: (origin, callback) => {
  //   if (allowedOrigins.findIndex((item) => origin?.startsWith(item)) > -1 || !origin) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  methods: ["GET", "POST"],
  allowedHeaders: Object.values(HEADERS),
};
app.use(cors(corsOptions));

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
