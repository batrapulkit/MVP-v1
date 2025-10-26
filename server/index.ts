import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./src/routes/registerRoutes"; // Your API routes
import { setupVite, serveStatic, log } from "./vite";

dotenv.config();

(async () => {
  // Create main Express app
  const app = express();

  // Parse JSON and form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Parse cookies
  app.use(cookieParser());

  // === FIXED CORS CONFIG ===
  app.use(
    cors({
      origin: [
        "http://127.0.0.1:2000",
        "http://localhost:2000",
        "https://triponic.com",
      ],
      credentials: true,
    })
  );

  // Register backend API routes under /api
  await registerRoutes(app);

  // Error handler for API routes
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) res.status(status).json({ message });
    console.error("❌ API Error:", err);
  });

  // ======== SERVE FRONTEND BUILD ========

  // Resolve __dirname since ES Modules don't have it by default
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Serve static files from the client build directory
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Fallback for React Router (serves index.html for all non-API routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });

  // ======== START SERVER ========
  const PORT = process.env.PORT || 3001;
  const HOST = "0.0.0.0";

  app.listen(PORT, HOST, () => {
    log(`✅ Triponic Server running on http://${HOST}:${PORT}`);
  });
})();
