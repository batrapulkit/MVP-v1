import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./src/routes/registerRoutes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const app = express();

  // Parse JSON and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // IMPORTANT: cookieParser must come BEFORE cors and routes
  app.use(cookieParser());

  // Setup CORS with dynamic origin
  const allowedOrigins = [
    "http://127.0.0.1:2000",
    "http://localhost:5000",
    "https://king-prawn-app-h3tyd.ondigitalocean.app",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  // Mount API routes
  await registerRoutes(app);

  // Setup Vite in development, serve static in production
  if (process.env.NODE_ENV === "development") {
    const server = await import("http").then(http => http.createServer(app));
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error(err);
  });

  // Use environment variable for port, fallback to 8080 (Digital Ocean default)
  const PORT = parseInt(process.env.PORT || "8080", 10);
  const HOST = process.env.HOST || "0.0.0.0"; // 0.0.0.0 allows external connections

  app.listen(PORT, HOST, () => {
    log(`✅ Server running at http://${HOST}:${PORT}`);
    log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  });
})();
