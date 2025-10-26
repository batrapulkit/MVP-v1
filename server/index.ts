import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { registerRoutes } from "./src/routes/registerRoutes";
import { setupVite, serveStatic, log } from "./vite";

dotenv.config();
const allowedOrigins = [
  "https://triponic.com",
  "https://www.triponic.com",
  "http://localhost:2000",
  "http://127.0.0.1:2000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // mobile apps, curl etc
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS not allowed from: " + origin), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

(async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(cors(corsOptions));

  // === API Routes ===
  await registerRoutes(app);

  // === Static Frontend ===
  if (app.get("env") === "development") {
    const http = await import("http");
    const server = http.createServer(app);
    await setupVite(app, server);
  } else {
    serveStatic(app);
    app.get("*", (req: Request, res: Response) => {
      res.sendFile("index.html", { root: "dist/public" });
    });
  }

  // === Error Handling ===
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error(err);
  });

  // === Server Start ===
  const PORT = process.env.PORT || 8080;
  const HOST = "0.0.0.0";
  app.listen(PORT, HOST, () => {
    log(`✅ Server running at http://${HOST}:${PORT}`);
  });
})();
