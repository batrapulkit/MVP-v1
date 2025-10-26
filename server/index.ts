import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./src/routes/registerRoutes";

dotenv.config();

(async () => {
  const app = express();

  // === MIDDLEWARE ===
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // === CORS CONFIG ===
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

  // === API ROUTES ===
  await registerRoutes(app);

  // === ERROR HANDLER ===
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) res.status(status).json({ message });
    console.error("❌ API Error:", err);
  });

  // === FRONTEND BUILD (React) ===
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDist = path.join(__dirname, "../client/dist");

  // Serve static assets
  app.use(express.static(clientDist));

  // Fallback to index.html for React Router
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });

  // === START SERVER ===
  const PORT = process.env.PORT || 8080;
  const HOST = "0.0.0.0";

  app.listen(PORT, HOST, () => {
    console.log(`✅ Triponic server running on http://${HOST}:${PORT}`);
  });
})();
