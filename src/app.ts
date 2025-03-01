import "express-async-errors";
import helmet from "helmet";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import httpStatus from "http-status";
import cors from "cors";
import routes from "@/routes/v1";
import morgan from "@/config/morgan";
import { ApiError } from "@/utils";
import { corsOptions, env } from "@/config";
import { authLimiter } from "@/middlewares/rateLimiter";
import { errorConverter, errorHandler } from "@/middlewares/error";

const app = express();

if (env.mode !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
//! app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors(corsOptions));

// limit repeated failed requests to auth endpoints
if (env.mode === "production") {
  app.use("/v1/auth", authLimiter);
}

// v1 api routes
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "No Endpoint found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

app.use(errorHandler);

export default app;
