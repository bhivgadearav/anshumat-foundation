import express from "express";
import cors from "cors";
import couponsRoutes from "./routes/coupons.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/notfound.middleware";

export const createServer = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/api/coupons", couponsRoutes);

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Demo login endpoint (hard-coded as per requirements)
  app.post("/api/demo-login", (req, res) => {
    const { email, password } = req.body;

    if (email === "hire-me@anshumat.org" && password === "HireMe@2025!") {
      res.json({
        success: true,
        user: {
          userId: "demo-user-001",
          userTier: "GOLD",
          country: "IN",
          lifetimeSpend: 10000,
          ordersPlaced: 5,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }
  });

  // 404 handler
  app.use(notFoundMiddleware);

  // Error handler
  app.use(errorMiddleware);

  return app;
};
