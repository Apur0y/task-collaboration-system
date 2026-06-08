import { Task } from "../store/types";
import { baseApi } from "./baseApi";

// API Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query<ApiResponse<Task[]>, void>({
      query: () => ({
        url: "tasks",
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    getTaskById: builder.query<ApiResponse<Task>, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),

    getTasksByProjectId: builder.query<ApiResponse<Task[]>, string>({
      query: (projectId) => ({
        url: `tasks/project/${projectId}`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [{ type: "Task", id: projectId }],
    }),

    createTask: builder.mutation<ApiResponse<Task>, Partial<Task>>({
      query: (data) => ({
        url: "tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation<ApiResponse<Task>, { id: string; data: Partial<Task> }>({
      query: ({ id, data }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),

    deleteTask: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useGetTasksByProjectIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
