// import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// interface ActivitiesState {
//   activities: any;
// }

// const initialState: ActivitiesState = {
//   activities: mockActivities,
// };

// const activitiesSlice = createSlice({
//   name: 'activities',
//   initialState,
//   reducers: {
//     addActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp'>>) => {
//       const newActivity: Activity = {
//         ...action.payload,
//         id: Date.now().toString(),
//         timestamp: new Date().toISOString(),
//       };
//       state.activities.unshift(newActivity);
//     },
//   },
// });

// export const { addActivity } = activitiesSlice.actions;
// export default activitiesSlice.reducer;
