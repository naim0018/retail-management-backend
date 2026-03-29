import express, { Request, Response } from "express";
import cors from "cors";

import { StatusCodes } from "http-status-codes";
import router from "./app/router/router";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://retailmanagementfrontend.vercel.app/",
      "https://retailmanagementfrontend.vercel.app",
      "https://retailmanagementfrontend-dm22rl2b3-naim0018s-projects.vercel.app",
    ],
    credentials: true,
  }),
);
// app.use(cors())
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Server connected",
    data: "Server is Running",
  });
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
