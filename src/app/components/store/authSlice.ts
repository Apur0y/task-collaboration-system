import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';
import { mockUsers } from './mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const user = mockUsers.find(u => u.email === action.payload.email);
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    },
    loginWithRole: (state, action: PayloadAction<User['role']>) => {
      const user = mockUsers.find(u => u.role === action.payload);
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    },
    signup: (state, action: PayloadAction<{ firstName: string; lastName: string; email: string; password: string }>) => {
      const newUser: User = {
        id: Date.now().toString(),
        name: `${action.payload.firstName} ${action.payload.lastName}`,
        email: action.payload.email,
        role: 'Team Member',
      };
      state.user = newUser;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, loginWithRole, signup, logout } = authSlice.actions;
export default authSlice.reducer;
