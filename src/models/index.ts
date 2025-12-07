export interface Eligibility {
  allowedUserTiers?: string[];
  minLifetimeSpend?: number;
  minOrdersPlaced?: number;
  firstOrderOnly?: boolean;
  allowedCountries?: string[];
  minCartValue?: number;
  applicableCategories?: string[];
  excludedCategories?: string[];
  minItemsCount?: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "FLAT" | "PERCENT";
  discountValue: number;
  maxDiscountAmount?: number;
  startDate: Date;
  endDate: Date;
  usageLimitPerUser?: number;
  eligibility: Eligibility;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserContext {
  userId: string;
  userTier: string;
  country: string;
  lifetimeSpend: number;
  ordersPlaced: number;
}

export interface CartItem {
  productId: string;
  category: string;
  unitPrice: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface BestCouponRequest {
  userContext: UserContext;
  cart: Cart;
}

export interface CouponResponse {
  coupon: Coupon | null;
  discountAmount: number;
}

export interface CreateCouponRequest {
  code: string;
  description: string;
  discountType: "FLAT" | "PERCENT";
  discountValue: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimitPerUser?: number;
  eligibility: Eligibility;
}
