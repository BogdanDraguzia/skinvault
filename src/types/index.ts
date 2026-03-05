// =====================================================
// SkinVault — TypeScript Type Definitions
// =====================================================

export interface Skin {
  id: number;
  assetId: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  type: string;
  exterior: string;
  quality: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneCode?: string;
  phone?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  addressLine?: string;
  steamId?: string;
  tradeLink?: string;
  balance: number;
}

export interface FilterState {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  subType?: string;
  quality?: string;
  exterior?: string;
  sort?: 'price_asc' | 'price_desc';
}

export interface CartItem {
  id: number;
  assetId: string;
  title: string;
  price: number;
  imageUrl: string;
  type: string;
  exterior: string;
  quality: string;
}

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  fullName: string;
  userId: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneCode?: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Profile Update DTOs
export interface UpdatePersonalRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode?: string;
  phone?: string;
}

export interface UpdateBillingRequest {
  country?: string;
  city?: string;
  zipCode?: string;
  addressLine?: string;
}

export interface UpdateSteamRequest {
  steamId?: string;
  tradeLink?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Orders
export interface OrderItem {
  skinId: number;
  skinName: string;
  skinImage: string;
  price: number;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export type OrderStatus = 'Pending' | 'Paid' | 'Failed' | 'Cancelled' | 'Delivered';

export interface CreateOrderRequest {
  skinIds: number[];
  steamTradeLink: string;
}

export interface CreateOrderResponse {
  orderId: string;
}

export interface CheckoutResponse {
  redirectUrl: string;
  orderId: string;
}

// Transactions
export type TransactionType = 'Deposit' | 'Withdrawal' | 'Purchase' | 'Sale';
export type TransactionStatus = 'Pending' | 'Completed' | 'Failed';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
}

// Payments
export interface DepositRequest {
  amount: number;
}

export interface DepositResponse {
  redirectUrl: string;
}

// Contact
export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Generic API message response
export interface MessageResponse {
  message: string;
}

// Skin query params
export interface SkinsQueryParams extends FilterState {
  page?: number;
  pageSize?: number;
  category?: string;
}
