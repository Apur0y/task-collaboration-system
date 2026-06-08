// src/features/auth/authApi.ts

import { Project } from "../store/types";
import { baseApi } from "./baseApi";



export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createProject: builder.mutation({
      query: (data) => ({
        url: "projects",
        method: "POST",
        body: data,
      }),
    }),


  getAllProjects: builder.query<Project[], void>({
  query: () => ({
    url: "projects",
    method: "GET",
  }),
}),


  }),
});

export const {
useCreateProjectMutation,
useGetAllProjectsQuery
} = authApi;