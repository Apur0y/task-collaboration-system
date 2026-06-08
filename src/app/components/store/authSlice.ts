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
    login: (state, action) => {
      
        state.user = action.payload;
        state.isAuthenticated = true;
     
    },
    loginWithRole: (state, action: PayloadAction<User['role']>) => {
      const user = mockUsers.find(u => u.role === action.payload);
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    },
    signup: (state, action) => {
     
      state.user =  action.payload;;
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
