import { Project } from "../store/types";
import { baseApi } from "./baseApi";

// API Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query<ApiResponse<Project[]>, void>({
      query: () => ({
        url: "projects",
        method: "GET",
      }),
      providesTags: ["Project"],
    }),

    getProjectById: builder.query<ApiResponse<Project>, string>({
      query: (id) => ({
        url: `projects/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),

    createProject: builder.mutation<ApiResponse<Project>, Partial<Project>>({
      query: (data) => ({
        url: "projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),

    updateProject: builder.mutation<ApiResponse<Project>, { id: string; data: Partial<Project> }>({
      query: ({ id, data }) => ({
        url: `projects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Project", id }],
    }),

    deleteProject: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
