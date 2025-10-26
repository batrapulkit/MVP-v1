import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { registerRoutes } from "./src/routes/registerRoutes"; // Your API routes
import { setupVite, serveStatic, log } from "./vite";

dotenv.config();

(async () => {
  // === API SERVER ===
  const apiApp = express();

  // Parse JSON and URL-encoded bodies
  apiApp.use(express.json());
  apiApp.use(express.urlencoded({ extended: false }));

  // cookieParser BEFORE cors and routes
  apiApp.use(cookieParser());

  // === FIXED CORS CONFIG ===
  apiApp.use(
    cors({
      origin: [
        "http://127.0.0.1:2000",
        "http://localhost:2000",
        "https://triponic.com", // main production domain
        "https://shark-app-fyixd.ondigitalocean.app", // DigitalOcean frontend URL (MUST include https://)
      ],
      credentials: true, // required for cookies to work cross-origin
    })
  );

  // Mount all API routes
  await registerRoutes(apiApp);

  // === ERROR HANDLER ===
  apiApp.use(
    (err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      if (!res.headersSent) {
        res.status(status).json({ message });
      }
      console.error("❌ Server Error:", err);
    }
  );

  // === START API SERVER ===
  const apiPort = process.env.PORT || 3001;
  const host = "0.0.0.0"; // important for DigitalOcean

  apiApp.listen(apiPort, host, () => {
    log(`✅ API Server running on http://${host}:${apiPort}`);
  });

  // === FRONTEND SERVER ===
  const frontendApp = express();

  if (frontendApp.get("env") === "development") {
    const frontendHttp = await import("http");
    const frontendServer = frontendHttp.createServer(frontendApp);
    await setupVite(frontendApp, frontendServer); // Vite dev setup
  } else {
    serveStatic(frontendApp); // Serve built frontend in production
  }

  const frontendPort = 2000;

  frontendApp.listen(frontendPort, "0.0.0.0", () => {
    log(`✅ Frontend Server running on http://0.0.0.0:${frontendPort}`);
  });
})();
