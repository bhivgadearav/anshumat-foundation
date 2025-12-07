import { Coupon } from "../models";

export class CouponRepository {
  private coupons = new Map<string, Coupon>();
  private couponUsage = new Map<string, Map<string, number>>(); // couponId -> userId -> usageCount

  async create(
    coupon: Omit<Coupon, "id" | "createdAt" | "updatedAt">,
  ): Promise<Coupon> {
    if (this.coupons.has(coupon.code)) {
      throw new Error(`Coupon with code ${coupon.code} already exists`);
    }

    const id = Math.random().toString(36).substring(7);
    const now = new Date();

    const newCoupon: Coupon = {
      ...coupon,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.coupons.set(coupon.code, newCoupon);
    this.couponUsage.set(id, new Map<string, number>());

    return newCoupon;
  }

  async findAll(): Promise<Coupon[]> {
    return Array.from(this.coupons.values());
  }

  async findByCode(code: string): Promise<Coupon | undefined> {
    return this.coupons.get(code);
  }

  async findAllValid(now: Date): Promise<Coupon[]> {
    const coupons = await this.findAll();
    return coupons.filter(
      (coupon) => coupon.startDate <= now && coupon.endDate >= now,
    );
  }

  async getUsageCount(couponId: string, userId: string): Promise<number> {
    const usageMap = this.couponUsage.get(couponId);
    return usageMap?.get(userId) || 0;
  }

  async incrementUsage(couponId: string, userId: string): Promise<void> {
    let usageMap = this.couponUsage.get(couponId);
    if (!usageMap) {
      usageMap = new Map<string, number>();
      this.couponUsage.set(couponId, usageMap);
    }

    const currentCount = usageMap.get(userId) || 0;
    usageMap.set(userId, currentCount + 1);
  }

  async deleteByCode(code: string): Promise<boolean> {
    const coupon = this.coupons.get(code);
    if (!coupon) return false;

    this.coupons.delete(code);
    this.couponUsage.delete(coupon.id);
    return true;
  }
}
