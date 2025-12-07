import { Request, Response } from "express";
import { CouponService } from "../services/coupons.service";
import { BestCouponRequest, CreateCouponRequest } from "../models";

export class CouponController {
  constructor(private couponService: CouponService) {}

  async createCoupon(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateCouponRequest = req.body;

      // Basic validation
      if (
        !data.code ||
        !data.description ||
        !data.discountType ||
        !data.discountValue
      ) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      if (data.discountType !== "FLAT" && data.discountType !== "PERCENT") {
        res.status(400).json({ error: "discountType must be FLAT or PERCENT" });
        return;
      }

      if (data.discountValue <= 0) {
        res.status(400).json({ error: "discountValue must be positive" });
        return;
      }

      const coupon = await this.couponService.createCoupon(data);
      res.status(201).json(coupon);
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async getAllCoupons(req: Request, res: Response): Promise<void> {
    try {
      const coupons = await this.couponService.getAllCoupons();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getBestCoupon(req: Request, res: Response): Promise<void> {
    try {
      const request: BestCouponRequest = req.body;

      // Basic validation
      if (!request.userContext || !request.cart) {
        res.status(400).json({ error: "Missing userContext or cart" });
        return;
      }

      const result = await this.couponService.getBestCoupon(request);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async seedDemoData(req: Request, res: Response): Promise<void> {
    try {
      // Demo coupons as specified in the assignment
      const demoCoupons: CreateCouponRequest[] = [
        {
          code: "WELCOME100",
          description: "₹100 off on first order",
          discountType: "FLAT",
          discountValue: 100,
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          usageLimitPerUser: 1,
          eligibility: {
            firstOrderOnly: true,
            minCartValue: 500,
          },
        },
        {
          code: "SUMMER20",
          description: "20% off on fashion",
          discountType: "PERCENT",
          discountValue: 20,
          maxDiscountAmount: 500,
          startDate: "2024-06-01",
          endDate: "2024-08-31",
          eligibility: {
            applicableCategories: ["fashion"],
            minCartValue: 1000,
          },
        },
        {
          code: "GOLD50",
          description: "₹50 flat discount for gold members",
          discountType: "FLAT",
          discountValue: 50,
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          eligibility: {
            allowedUserTiers: ["GOLD"],
          },
        },
      ];

      const createdCoupons = [];
      for (const couponData of demoCoupons) {
        try {
          const coupon = await this.couponService.createCoupon(couponData);
          createdCoupons.push(coupon);
        } catch (error) {
          // Skip if already exists
        }
      }

      res.json({
        message: "Demo coupons seeded successfully",
        count: createdCoupons.length,
        coupons: createdCoupons,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
