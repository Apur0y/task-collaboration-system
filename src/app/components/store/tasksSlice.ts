import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, Comment, Attachment } from './types';
import { mockTasks } from './mockData';

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: mockTasks,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        comments: [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    addComment: (state, action: PayloadAction<{ taskId: string; comment: Omit<Comment, 'id' | 'createdAt'> }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        const newComment: Comment = {
          ...action.payload.comment,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        task.comments.push(newComment);
        task.updatedAt = new Date().toISOString();
      }
    },
    addAttachment: (state, action: PayloadAction<{ taskId: string; attachment: Omit<Attachment, 'id' | 'uploadedAt'> }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        const newAttachment: Attachment = {
          ...action.payload.attachment,
          id: Date.now().toString(),
          uploadedAt: new Date().toISOString(),
        };
        task.attachments.push(newAttachment);
        task.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, addComment, addAttachment } = tasksSlice.actions;
export default tasksSlice.reducer;
