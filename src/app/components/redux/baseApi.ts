// src/redux/api/baseApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_API,
    credentials: "include",
  }),
  tagTypes:["Project","Task"],

  endpoints: () => ({}),
});