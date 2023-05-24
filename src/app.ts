import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import positionRoutes from "./routes/position.routes";
import candidateRoutes from "./routes/candidates.routes";
import vacantRoutes from "./routes/vacant.routes";
import evaluationRoutes from "./routes/evaluation.routes";
import interviewRoutes from "./routes/interview.routes";
import questionRoutes from "./routes/question.routes";

const DEFAULT_PORT = 3000;

function createApp(): Application {
  // Settings
  const app = express();
  app.set("port", process.env.PORT || DEFAULT_PORT);

  // Middlewares
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.static('src/public'));

  // Routes
  app.use("/user", userRoutes);
  app.use("/auth", authRoutes);
  app.use("/position", positionRoutes);
  app.use("/candidate", candidateRoutes);
  app.use("/vacant", vacantRoutes);
  app.use("/evaluation", evaluationRoutes);
  app.use("/interview", interviewRoutes);
  app.use("/question", questionRoutes);

  return app;
}

export async function app(): Promise<void> {
  const app = await createApp();
  await app.listen(app.get("port"));
  console.log(`Server listening on port ${app.get("port")}`);
}
