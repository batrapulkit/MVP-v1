import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./src/routes/registerRoutes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

(async () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // CORS setup
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? true // allow all in production
          : "http://127.0.0.1:2000", // dev mode
      credentials: true,
    })
  );

  // Register API routes
  await registerRoutes(app);

  // Error handler
  app.use(
    (err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      if (!res.headersSent) {
        res.status(status).json({ message });
      }
      console.error(err);
    }
  );

  // === Frontend Handling ===
  if (process.env.NODE_ENV === "development") {
    const http = await import("http");
    const server = http.createServer(app);
    await setupVite(app, server);
  } else {
    // In production: serve built frontend
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    serveStatic(app);

    // SPA fallback for React Router
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // === Unified Server ===
  const PORT = process.env.PORT || 8080;
  const HOST = "0.0.0.0";

  app.listen(PORT, HOST, () => {
    log(`✅ Triponic server running at http://${HOST}:${PORT}`);
  });
})();
