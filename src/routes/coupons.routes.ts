import { Router } from "express";
import { CouponController } from "../controllers/coupons.controller";
import { CouponService } from "../services/coupons.service";
import { CouponRepository } from "../repositories/coupons.repository";

const router = Router();

const couponRepository = new CouponRepository();
const couponService = new CouponService(couponRepository);
const couponController = new CouponController(couponService);

// POST /coupons - Create a new coupon
router.post("/", (req, res) => couponController.createCoupon(req, res));

// GET /coupons - Get all coupons (for debugging/testing)
router.get("/", (req, res) => couponController.getAllCoupons(req, res));

// POST /coupons/best-match - Get best coupon for user and cart
router.post("/best-match", (req, res) =>
  couponController.getBestCoupon(req, res),
);

// POST /coupons/seed - Seed demo data (optional)
router.post("/seed", (req, res) => couponController.seedDemoData(req, res));

export default router;
