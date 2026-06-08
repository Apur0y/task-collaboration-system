export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum ProjectRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
}

export enum TaskPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ================= PROJECT =================

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  deadline: string;
  status: ProjectStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;

  owner?: User;
  members?: ProjectMember[];
  tasks?: Task[];
}

// ================= PROJECT MEMBER =================

export interface ProjectMember {
  projectId: string;
  userId: string;
  assignedAt: string;
  role: ProjectRole;

  project?: Project;
  user?: User;
}

// ================= TASK =================

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  projectId: string;
  assignedMemberId?: string | null;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;

  project?: Project;
  assignedMember?: User | null;
}

// ================= COMMENT =================

export interface Comment {
  id: string;
  text: string;
  taskId: string;
  userId: string;
  createdAt: string;

  task?: Task;
  user?: User;
}

// ================= ATTACHMENT =================

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  taskId: string;
  uploadedById: string;
  createdAt: string;

  task?: Task;
  uploadedBy?: User;
}

// ================= ACTIVITY LOG =================

export interface ActivityLog {
  id: string;
  action: string;
  userId?: string | null;
  projectId?: string | null;
  createdAt: string;

  user?: User | null;
  project?: Project | null;
}