import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./src/routes/registerRoutes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const app = express();

  // Parse request bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Cookie parser must come early
  app.use(cookieParser());

  // Configure allowed origins
  const allowedOrigins = [
    "http://127.0.0.1:2000",
    "http://localhost:5000",
    "https://shark-app-fyixd.ondigitalocean.app", // ✅ no trailing slash
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  // Mount API routes
  await registerRoutes(app);

  // Environment-specific behavior
  if (process.env.NODE_ENV === "development") {
    const { createServer } = await import("http");
    const server = createServer(app);
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) res.status(status).json({ message });
    console.error("❌ Server Error:", err);
  });

  // Start server
  const PORT = parseInt(process.env.PORT || "8080", 10);
  const HOST = process.env.HOST || "0.0.0.0";

  app.listen(PORT, HOST, () => {
    log(`✅ Server running at http://${HOST}:${PORT}`);
    log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  });
})();
