import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Plus,
  ArrowLeft,
  Kanban,
  TableIcon,
  Calendar,
  User,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Task, TaskStatus, TaskPriority } from "../store/types";
import { formatDate, formatDateTime } from "../lib/utils";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../components/store/hooks";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["To Do", "In Progress", "In Review", "Completed"] as const),
  priority: z.enum(["Low", "Medium", "High"] as const),
  assignedTo: z.array(z.string()).min(1, "At least one assignee required"),
  dueDate: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Due date cannot be in the past",
  }),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface KanbanTaskCardProps {
  task: Task;
  onClick: () => void;
}

function KanbanTaskCard({ task, onClick }: KanbanTaskCardProps) {
  const dispatch = useAppDispatch();
  const teamMembers = useAppSelector((state) => state.team.members);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-orange-500";
      case "Low":
        return "bg-green-500";
    }
  };

  const getAssigneeNames = () => {
    return task.assignedTo
      .map((id) => {
        const member = teamMembers.find((m) => m.id === id);
        return member ? member.name.split(" ")[0] : "Unknown";
      })
      .join(", ");
  };

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-move"
    >
      <Card className="hover:shadow-md transition-shadow" onClick={onClick}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </div>
            <div className="flex items-center gap-2">
              {task.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {task.comments.length}
                </div>
              )}
              {task.attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  {task.attachments.length}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <User className="h-3 w-3" />
            <span className="line-clamp-1">{getAssigneeNames()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

function KanbanColumn({ status, tasks, onTaskClick }: KanbanColumnProps) {
  const dispatch = useAppDispatch();
  const allTasks = useAppSelector((state) => state.tasks.tasks);

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string }) => {
      const draggedTask = allTasks.find((t) => t.id === item.id);
      if (!draggedTask || draggedTask.status === status) return;

      if (draggedTask.status === "Completed" && status !== "Completed") {
        toast.error("Cannot move completed tasks");
        return;
      }

      dispatch(updateTask({ ...draggedTask, status }));
      toast.success(`Task moved to ${status}`);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getColumnColor = () => {
    switch (status) {
      case "To Do":
        return "border-t-purple-500";
      case "In Progress":
        return "border-t-blue-500";
      case "In Review":
        return "border-t-orange-500";
      case "Completed":
        return "border-t-green-500";
    }
  };

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[280px] border-t-4 ${getColumnColor()} ${
        isOver ? "bg-accent/50" : ""
      }`}
    >
      <div className="bg-muted/50 p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{status}</h3>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
      </div>
      <div className="p-4 space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <KanbanTaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const project = useAppSelector((state) =>
    state.projects.projects.find((p) => p.id === id)
  );
  const allTasks = useAppSelector((state) => state.tasks.tasks);
  const teamMembers = useAppSelector((state) => state.team.members);

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState("");

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      assignedTo: [],
      dueDate: "",
    },
  });

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <Button onClick={() => navigate("/projects")} className="mt-4">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const projectTasks = allTasks.filter((task) => task.projectId === id);
  
  const canCreateTask = user?.role === "Admin" || user?.role === "Project Manager";
  const canDeleteTask = user?.role === "Admin" || user?.role === "Project Manager";

  const handleCreateTask = (data: TaskFormData) => {
    // Check for duplicate titles
    const duplicate = projectTasks.find(
      (t) => t.title.toLowerCase() === data.title.toLowerCase()
    );
    if (duplicate) {
      toast.error("A task with this title already exists in this project");
      return;
    }

    dispatch(
      addTask({
        ...data,
        projectId: id!,
      })
    );
    toast.success("Task created successfully");
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleAddComment = () => {
    if (!selectedTask || !commentText.trim() || !user) return;

    dispatch(
      addComment({
        taskId: selectedTask.id,
        comment: {
          userId: user.id,
          userName: user.name,
          content: commentText,
        },
      })
    );
    setCommentText("");
    toast.success("Comment added");
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-orange-500";
      case "Low":
        return "bg-green-500";
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>
          {canCreateTask && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to {project.name}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleCreateTask)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input id="title" {...form.register("title")} />
                      {form.formState.errors.title && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" {...form.register("description")} />
                      {form.formState.errors.description && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          defaultValue="To Do"
                          onValueChange={(value) =>
                            form.setValue("status", value as TaskStatus)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="In Review">In Review</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          defaultValue="Medium"
                          onValueChange={(value) =>
                            form.setValue("priority", value as TaskPriority)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Assign To</Label>
                      <Select
                        onValueChange={(value) => {
                          const current = form.getValues("assignedTo");
                          if (!current.includes(value)) {
                            form.setValue("assignedTo", [...current, value]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team members" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} - {member.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.watch("assignedTo").map((memberId) => {
                          const member = teamMembers.find((m) => m.id === memberId);
                          return member ? (
                            <Badge key={memberId} variant="secondary">
                              {member.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      {form.formState.errors.assignedTo && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.assignedTo.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        {...form.register("dueDate")}
                      />
                      {form.formState.errors.dueDate && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.dueDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="submit">Create Task</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "kanban" | "table")}>
          <TabsList>
            <TabsTrigger value="kanban">
              <Kanban className="mr-2 h-4 w-4" />
              Kanban Board
            </TabsTrigger>
            <TabsTrigger value="table">
              <TableIcon className="mr-2 h-4 w-4" />
              Table View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {(["To Do", "In Progress", "In Review", "Completed"] as TaskStatus[]).map(
                (status) => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    tasks={projectTasks.filter((t) => t.status === status)}
                    onTaskClick={setSelectedTask}
                  />
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-semibold">Task</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Priority</th>
                        <th className="text-left p-4 font-semibold">Assigned To</th>
                        <th className="text-left p-4 font-semibold">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="border-t hover:bg-muted/30 cursor-pointer"
                          onClick={() => setSelectedTask(task)}
                        >
                          <td className="p-4">{task.title}</td>
                          <td className="p-4">
                            <Badge variant="outline">{task.status}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {task.assignedTo
                              .map((id) => teamMembers.find((m) => m.id === id)?.name)
                              .join(", ")}
                          </td>
                          <td className="p-4">{formatDate(task.dueDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Task Details Sheet */}
        <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            {selectedTask && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedTask.title}</SheetTitle>
                  <SheetDescription>Task details and comments</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedTask.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Status</h4>
                      <Badge variant="outline">{selectedTask.status}</Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Priority</h4>
                      <Badge className={getPriorityColor(selectedTask.priority)}>
                        {selectedTask.priority}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Due Date</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedTask.dueDate)}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Assigned To</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.assignedTo.map((memberId) => {
                        const member = teamMembers.find((m) => m.id === memberId);
                        return member ? (
                          <Badge key={memberId} variant="secondary">
                            {member.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {selectedTask.attachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Attachments</h4>
                      <div className="space-y-2">
                        {selectedTask.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 p-2 border rounded-md"
                          >
                            <Paperclip className="h-4 w-4" />
                            <span className="text-sm flex-1">{attachment.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {(attachment.size / 1024).toFixed(2)} KB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold mb-4">Comments</h4>
                    <div className="space-y-4 mb-4">
                      {selectedTask.comments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No comments yet
                        </p>
                      ) : (
                        selectedTask.comments.map((comment) => (
                          <div key={comment.id} className="border-l-2 pl-4 py-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">
                                {comment.userName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {comment.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DndProvider>
  );
}