import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerRoutes } from "./src/routes/registerRoutes";
import { setupVite, serveStatic, log } from "./vite";
// 🔹 Load environment variables
dotenv.config();

// 🔹 Allowed origins (local + production)
const allowedOrigins = [
  "https://triponic.com",
  "https://www.triponic.com",
  "http://localhost:2000",
  "http://127.0.0.1:2000",
];

// 🔹 Updated and stable CORS configuration
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

(async () => {
  const app = express();

  // === Core Middleware ===
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // === CORS Setup ===
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions)); // Handle preflight requests for all routes

  // === TEMP AUTH TEST ROUTES (for login debugging) ===
  // ⚠️ Optional: remove or move later
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";

  // In-memory store just for testing
  const users: any[] = [];

  app.post("/api/register", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existingUser = users.find((u) => u.email === email);
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    users.push({ email, password: hashed });
    res.status(201).json({ message: "User registered" });
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    // ✅ Correct cookie setup
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", email: user.email });
  });

  app.post("/api/logout", (_req: Request, res: Response) => {
    res.clearCookie("token", { path: "/" });
    res.json({ message: "Logged out" });
  });

  // ✅ Auth test route
  app.get("/api/me", (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      res.json({ message: "Authenticated", user: decoded });
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  });

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
      // ⚠️ Ensure correct build directory
      res.sendFile("index.html", { root: "dist" });
    });
  }

  // === Error Handling ===
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error("Server Error:", err);
  });

  // === Server Start ===
  const PORT = process.env.PORT || 8080;
  const HOST = "0.0.0.0";
  app.listen(PORT, HOST, () => {
    log(`✅ Server running at http://${HOST}:${PORT}`);
  });
})();
