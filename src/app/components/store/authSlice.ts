import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types";
import { mockUsers } from "./mockData";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Wait for getMe on app startup
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {

      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    loginWithRole: (state, action) => {
        state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    signup: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  login,
  loginWithRole,
  signup,
  logout,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;