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
import { Task, TaskStatus, TaskPriority } from "../components/store/types";
import { formatDate, formatDateTime } from "../lib/utils";
import { toast } from "sonner";
import { useAppSelector } from "../components/store/hooks";
import { useGetProjectByIdQuery } from "../components/redux/projectApi";
import { useGetTasksByProjectIdQuery, useCreateTaskMutation, useUpdateTaskMutation } from "../components/redux/taskApi";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  assignedMemberId: z.string().nullable().optional(),
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
const {id}=useParams()
  const { data: projectData, isLoading: isProjectLoading } = useGetProjectByIdQuery(id!);
 const project = projectData?.data;
  const teamMembers =project?.members
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "bg-red-500";
      case TaskPriority.MEDIUM:
        return "bg-orange-500";
      case TaskPriority.LOW:
        return "bg-green-500";
    }
  };

  const getAssigneeNames = () => {
    if (!task.assignedMemberId) return "Unassigned";
    const member = teamMembers.find((m) => m.userId === task.assignedMemberId);
    return member ? member.name.split(" ")[0] : "Unknown";
  };

  return (
    <Card 
      ref={drag as any}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="hover:shadow-md transition-shadow cursor-move"
      onClick={onClick}
    >
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
        </div>
        <div className="flex items-center gap-1 text-xs">
          <User className="h-3 w-3" />
          <span className="line-clamp-1">{getAssigneeNames()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  projectId: string;
}

function KanbanColumn({ status, tasks, onTaskClick, projectId }: KanbanColumnProps) {
  const [updateTask] = useUpdateTaskMutation();

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: async (item: { id: string }) => {
      try {
        await updateTask({
          id: item.id,
          data: { status },
        }).unwrap();
        toast.success(`Task moved to ${status}`);
      } catch (error) {
        toast.error("Failed to move task");
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getColumnColor = () => {
    switch (status) {
      case TaskStatus.TODO:
        return "border-t-purple-500";
      case TaskStatus.IN_PROGRESS:
        return "border-t-blue-500";
      case TaskStatus.COMPLETED:
        return "border-t-green-500";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case TaskStatus.TODO:
        return "To Do";
      case TaskStatus.IN_PROGRESS:
        return "In Progress";
      case TaskStatus.COMPLETED:
        return "Completed";
    }
  };

  return (
    <div
      ref={drop as any}
      className={`flex-1 min-w-[280px] border-t-4 ${getColumnColor()} ${
        isOver ? "bg-accent/50" : ""
      }`}
    >
      <div className="bg-muted/50 p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{getStatusLabel()}</h3>
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
  const user = useAppSelector((state) => state.auth.user);
  // const teamMembers = useAppSelector((state) => state.team.members);

  const { data: projectData, isLoading: isProjectLoading } = useGetProjectByIdQuery(id!);
  const { data: tasksData } = useGetTasksByProjectIdQuery(id!);
  const [createTask] = useCreateTaskMutation();

  const project = projectData?.data;
  const teamMembers =project?.members
  const projectTasks = tasksData?.data || [];
  console.log("MEm",teamMembers);

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState("");

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignedMemberId: null,
      dueDate: "",
    },
  });

  if (!project && !isProjectLoading) {
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

  const handleCreateTask = async (data: TaskFormData) => {

    console.log("task data",data);
    
    // Check for duplicate titles
    // const duplicate = projectTasks.find(
    //   (t) => t.title.toLowerCase() === data.title.toLowerCase()
    // );
    // if (duplicate) {
    //   toast.error("A task with this title already exists in this project");
    //   return;
    // }

    try {
      await createTask({
        ...data,
        projectId: id!,
      }).unwrap();
      toast.success("Task created successfully");
      setIsCreateDialogOpen(false);
      form.reset({
        title: "",
        description: "",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assignedMemberId: null,
        dueDate: "",
      });
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleAddComment = () => {
    if (!selectedTask || !commentText.trim() || !user) return;
    // TODO: Implement comment API when backend is ready
    setCommentText("");
    toast.success("Comment added");
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "bg-red-500";
      case TaskPriority.MEDIUM:
        return "bg-orange-500";
      case TaskPriority.LOW:
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
              <h1 className="text-3xl font-bold tracking-tight">{project?.name}</h1>
              <p className="text-muted-foreground">{project?.description}</p>
            </div>
          </div>
          
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to {project?.name}
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
                          value={form.watch("status")}
                          onValueChange={(value) =>
                            form.setValue("status", value as TaskStatus)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                            <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={form.watch("priority")}
                          onValueChange={(value) =>
                            form.setValue("priority", value as TaskPriority)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                            <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                            <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assignedMemberId">Assign To</Label>
                      <Select
                        value={form.watch("assignedMemberId") || ""}
                        onValueChange={(value) => {
                          form.setValue("assignedMemberId", value || null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a team member" />
                        </SelectTrigger>
                        {/* <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          {teamMembers?.map((member) => (
                            <SelectItem key={member.userId} value={member.userId}>
                              {member.userEmail} - {member.role}
                            </SelectItem>
                          ))}
                        </SelectContent> */}
                      </Select>
                      {form.watch("assignedMemberId") && (
                        <div className="mt-2">
                          {/* <Badge variant="secondary">
                            {teamMembers.find((m) => m.id === form.watch("assignedMemberId"))?.name}
                          </Badge> */}
                        </div>
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
              {[TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED].map(
                (status) => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    projectId={id!}
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
                      {projectTasks?.map((task) => (
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
                          {/* <td className="p-4">
                            {task.assignedMemberId
                              ? teamMembers.find((m) => m.id === task.assignedMemberId)?.name || "Unknown"
                              : "Unassigned"}
                          </td> */}
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
                    {selectedTask.assignedMemberId ? (
                      <Badge variant="secondary">
                        {/* {teamMembers.find((m) => m.id === selectedTask.assignedMemberId)?.name || "Unknown"} */}
                      </Badge>
                    ) : (
                      <p className="text-sm text-muted-foreground">Unassigned</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-4">Comments</h4>
                    <div className="space-y-4 mb-4">
                      <p className="text-sm text-muted-foreground">
                        Comments feature coming soon
                      </p>
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