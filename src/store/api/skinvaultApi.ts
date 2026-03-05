import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import type {
  Skin, PagedResult, UserProfile, FilterState,
  LoginRequest, LoginResponse, RegisterRequest, RegisterResponse,
  ForgotPasswordRequest, ResetPasswordRequest, MessageResponse,
  UpdatePersonalRequest, UpdateBillingRequest, UpdateSteamRequest, ChangePasswordRequest,
  Order, CreateOrderRequest, CreateOrderResponse, CheckoutResponse,
  Transaction, DepositRequest, DepositResponse, ContactRequest, SkinsQueryParams,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://localhost:7123';

export const skinvaultApi = createApi({
  reducerPath: 'skinvaultApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Profile', 'Orders', 'Transactions', 'Skins'],
  endpoints: (builder) => ({

    // ─── Skins ────────────────────────────────────────────────────────────────
    getSkins: builder.query<PagedResult<Skin>, SkinsQueryParams>({
      query: (params) => ({
        url: 'skins',
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 30,
          ...(params.category && { category: params.category }),
          ...(params.search && { search: params.search }),
          ...(params.minPrice !== undefined && { minPrice: params.minPrice }),
          ...(params.maxPrice !== undefined && { maxPrice: params.maxPrice }),
          ...(params.type && { type: params.type }),
          ...(params.subType && { subType: params.subType }),
          ...(params.quality && { quality: params.quality }),
          ...(params.exterior && { exterior: params.exterior }),
          ...(params.sort && { sort: params.sort }),
        },
      }),
      providesTags: ['Skins'],
    }),

    getSkinById: builder.query<Skin, number>({
      query: (id) => `skins/${id}`,
    }),

    // ─── Auth ─────────────────────────────────────────────────────────────────
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: 'auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // ─── Profile ──────────────────────────────────────────────────────────────
    getProfile: builder.query<UserProfile, void>({
      query: () => 'auth/profile',
      providesTags: ['Profile'],
    }),

    updatePersonal: builder.mutation<UserProfile, UpdatePersonalRequest>({
      query: (data) => ({ url: 'auth/profile/personal', method: 'PUT', body: data }),
      invalidatesTags: ['Profile'],
    }),

    updateBilling: builder.mutation<UserProfile, UpdateBillingRequest>({
      query: (data) => ({ url: 'auth/profile/billing', method: 'PUT', body: data }),
      invalidatesTags: ['Profile'],
    }),

    updateSteam: builder.mutation<UserProfile, UpdateSteamRequest>({
      query: (data) => ({ url: 'auth/profile/steam', method: 'PUT', body: data }),
      invalidatesTags: ['Profile'],
    }),

    changePassword: builder.mutation<MessageResponse, ChangePasswordRequest>({
      query: (data) => ({ url: 'auth/profile/change-password', method: 'POST', body: data }),
    }),

    // ─── Orders ───────────────────────────────────────────────────────────────
    getOrders: builder.query<Order[], void>({
      query: () => 'orders/me',
      providesTags: ['Orders'],
    }),

    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (data) => ({ url: 'orders', method: 'POST', body: data }),
      invalidatesTags: ['Orders', 'Profile'],
    }),

    checkout: builder.mutation<CheckoutResponse, CreateOrderRequest>({
      query: (data) => ({ url: 'orders/checkout', method: 'POST', body: data }),
    }),

    // ─── Payments ─────────────────────────────────────────────────────────────
    createDeposit: builder.mutation<DepositResponse, DepositRequest>({
      query: (data) => ({ url: 'payments/deposit', method: 'POST', body: data }),
    }),

    // ─── Transactions ─────────────────────────────────────────────────────────
    getTransactions: builder.query<Transaction[], void>({
      query: () => 'transactions/me',
      providesTags: ['Transactions'],
    }),

    // ─── Support ──────────────────────────────────────────────────────────────
    contactSupport: builder.mutation<MessageResponse, ContactRequest>({
      query: (data) => ({ url: 'support/contact', method: 'POST', body: data }),
    }),
  }),
});

export const {
  useGetSkinsQuery,
  useGetSkinByIdQuery,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdatePersonalMutation,
  useUpdateBillingMutation,
  useUpdateSteamMutation,
  useChangePasswordMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useCheckoutMutation,
  useCreateDepositMutation,
  useGetTransactionsQuery,
  useContactSupportMutation,
} = skinvaultApi;
