import { CouponRepository } from "../repositories/coupons.repository";
import {
  Coupon,
  UserContext,
  Cart,
  CartItem,
  BestCouponRequest,
  CouponResponse,
  CreateCouponRequest,
} from "../models";

export class CouponService {
  constructor(private couponRepository: CouponRepository) {}

  async createCoupon(data: CreateCouponRequest): Promise<Coupon> {
    const couponData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };

    return this.couponRepository.create(couponData);
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return this.couponRepository.findAll();
  }

  async getBestCoupon(request: BestCouponRequest): Promise<CouponResponse> {
    const now = new Date();
    const validCoupons = await this.couponRepository.findAllValid(now);

    const eligibleCoupons: Array<{ coupon: Coupon; discountAmount: number }> =
      [];

    for (const coupon of validCoupons) {
      if (!this.isCouponEligible(coupon, request.userContext, request.cart)) {
        continue;
      }

      const discountAmount = this.calculateDiscountAmount(coupon, request.cart);
      eligibleCoupons.push({ coupon, discountAmount });
    }

    if (eligibleCoupons.length === 0) {
      return { coupon: null, discountAmount: 0 };
    }

    // Select best coupon: highest discount, then earliest endDate, then lexicographically smaller code
    eligibleCoupons.sort((a, b) => {
      // 1. Highest discount amount
      if (b.discountAmount !== a.discountAmount) {
        return b.discountAmount - a.discountAmount;
      }

      // 2. Earliest endDate
      if (a.coupon.endDate.getTime() !== b.coupon.endDate.getTime()) {
        return a.coupon.endDate.getTime() - b.coupon.endDate.getTime();
      }

      // 3. Lexicographically smaller code
      return a.coupon.code.localeCompare(b.coupon.code);
    });

    return {
      coupon: eligibleCoupons[0].coupon,
      discountAmount: eligibleCoupons[0].discountAmount,
    };
  }

  private isCouponEligible(
    coupon: Coupon,
    user: UserContext,
    cart: Cart,
  ): boolean {
    const eligibility = coupon.eligibility;

    // Check usage limit
    if (coupon.usageLimitPerUser !== undefined) {
      const usageCount = 0; // In a real system, get from repository
      if (usageCount >= coupon.usageLimitPerUser) {
        return false;
      }
    }

    // User-based checks
    if (
      eligibility.allowedUserTiers &&
      !eligibility.allowedUserTiers.includes(user.userTier)
    ) {
      return false;
    }

    if (
      eligibility.minLifetimeSpend !== undefined &&
      user.lifetimeSpend < eligibility.minLifetimeSpend
    ) {
      return false;
    }

    if (
      eligibility.minOrdersPlaced !== undefined &&
      user.ordersPlaced < eligibility.minOrdersPlaced
    ) {
      return false;
    }

    if (eligibility.firstOrderOnly && user.ordersPlaced !== 0) {
      return false;
    }

    if (
      eligibility.allowedCountries &&
      !eligibility.allowedCountries.includes(user.country)
    ) {
      return false;
    }

    // Cart-based checks
    const cartValue = this.calculateCartValue(cart);

    if (
      eligibility.minCartValue !== undefined &&
      cartValue < eligibility.minCartValue
    ) {
      return false;
    }

    const cartCategories = new Set(cart.items.map((item) => item.category));

    if (
      eligibility.applicableCategories &&
      !eligibility.applicableCategories.some((cat) => cartCategories.has(cat))
    ) {
      return false;
    }

    if (
      eligibility.excludedCategories &&
      eligibility.excludedCategories.some((cat) => cartCategories.has(cat))
    ) {
      return false;
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    if (
      eligibility.minItemsCount !== undefined &&
      totalItems < eligibility.minItemsCount
    ) {
      return false;
    }

    return true;
  }

  private calculateCartValue(cart: Cart): number {
    return cart.items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0,
    );
  }

  private calculateDiscountAmount(coupon: Coupon, cart: Cart): number {
    const cartValue = this.calculateCartValue(cart);

    if (coupon.discountType === "FLAT") {
      return Math.min(coupon.discountValue, cartValue);
    }

    // PERCENT discount
    const discountAmount = (cartValue * coupon.discountValue) / 100;

    if (coupon.maxDiscountAmount !== undefined) {
      return Math.min(discountAmount, coupon.maxDiscountAmount);
    }

    return discountAmount;
  }
}
