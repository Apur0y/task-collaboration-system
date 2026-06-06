export type UserRole = 'Admin' | 'Project Manager' | 'Team Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type ProjectStatus = 'Active' | 'Completed' | 'On Hold';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  deadline: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string[];
  dueDate: string;
  comments: Comment[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'task_created' | 'task_assigned' | 'task_completed' | 'project_created' | 'member_added';
  description: string;
  timestamp: string;
  userId: string;
}

export interface TeamMember extends User {
  tasksAssigned: number;
  tasksCompleted: number;
  workloadPercentage: number;
}
