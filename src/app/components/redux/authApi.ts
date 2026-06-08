// src/features/auth/authApi.ts

import { baseApi } from "./baseApi";



export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi;