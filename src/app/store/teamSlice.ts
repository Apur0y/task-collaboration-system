import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TeamMember } from './types';
import { mockTeamMembers } from './mockData';

interface TeamState {
  members: TeamMember[];
}

const initialState: TeamState = {
  members: mockTeamMembers,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    addTeamMember: (state, action: PayloadAction<TeamMember>) => {
      state.members.push(action.payload);
    },
    updateTeamMember: (state, action: PayloadAction<TeamMember>) => {
      const index = state.members.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
      }
    },
    removeTeamMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(m => m.id !== action.payload);
    },
  },
});

export const { addTeamMember, updateTeamMember, removeTeamMember } = teamSlice.actions;
export default teamSlice.reducer;
