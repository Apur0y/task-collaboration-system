Act as an expert Senior Frontend Engineer and UI/UX Designer. Your task is to build the frontend for a "Smart Project & Task Collaboration System" using Next.js 14+ (App Router), Tailwind CSS, TypeScript, and Shadcn UI (or Radix primitives). Use Framer Motion for smooth, professional micro-interactions and transitions.

Ensure the code is modular, highly scalable, strictly typed, and structured cleanly. Implement mock/dummy data handlers or a mock state management layer (like Redux & Redux toolkit ) so the entire application is fully functional and interactive on the client side before API integration.

### 1. Project Tech Stack & Conventions
- **Framework:** Next.js latest (App Router, Client Components where interactivity is needed).
- **Styling:** Tailwind CSS (with utility classes organized logically).
- **Components & Icons:** React Icons & Lucide React for iconography.
- **Animations:** Framer Motion (subtle page transitions, modal fades, stagger layouts, and smooth status changes).
- **Charts:** Recharts or Chart.js (clean, modern dashboards).
- **Form Handling:** React Hook Form + Zod for strict client-side schema validation.

---

### 2. Design System & Layout Requirements
- **Theme:** Implement a flawless Dark/Light mode toggle utilizing `next-themes`. 
- **Layout:** A persistent, responsive App Layout featuring a collapsible Sidebar navigation, a top Navbar (with global search, notification bell with dot indicator, and User Profile dropdown), and a main scrollable content area.
- **Responsive Grid:** All tables, lists, and KPI dashboards must gracefully scale from mobile viewports to ultra-wide monitors.

---

### 3. Core Pages & UI Component Specifications

#### Page 1: Authentication (`/login` & `/signup`)
- Clean, centered card layout with tabs for Login and Signup.
- Standard fields (Email, Password, Name for signup) with real-time validation via Zod.
- **Crucial Feature:** Add a prominent "Demo Login" section with pre-filled credential quick-buttons for roles: `Admin`, `Project Manager`, and `Team Member`. Clicking a button instantly signs the user in with that specific role context.

#### Page 2: Analytics Dashboard (`/dashboard`)
- **KPI Cards Grid:** 5 sleek cards displaying: Total Projects, Total Tasks, Completed Tasks, Pending Tasks, and Overdue Tasks. Include subtle hover animations and progress rings.
- **Charts Section:** - A Doughnut/Pie chart for *Task Status Distribution*.
  - A Bar chart for *Tasks by Priority* (High, Medium, Low).
  - A Line chart showing the *Project Progress Trend*.
- **Dashboard Sidebar/Widgets:** - *Recent Activity Log:* A vertical timeline displaying the 5 latest system actions with timestamps (e.g., "10:15 AM — Task 'Setup API' assigned to John").
  - *Upcoming Deadlines / High Priority Tasks:* A quick-glance list of urgent deliverables.
  - *Member Workload Summary:* A list of team members with progress bars tracking their assigned vs completed tasks.

#### Page 3: Project Management (`/projects`)
- Grid/List toggle layout to view all projects. Each card shows: Project Name, Description, Status Tag (Active, Completed, On Hold), Deadline, and a percentage progress bar based on sub-task completion.
- Interactive **"Create Project" Modal** with client validation.
- Row action menus (Lucide Ellipsis icon) for Editing and Deleting projects.
- Search bar to filter projects dynamically by name.

#### Page 4: Project Details & Task Board (`/projects/[id]`)
- **Split View or Tab Layout:** Toggle between a "Kanban Board" and a "Detailed Table View".
- **Task Management Features:**
  - Create, Edit, and Delete tasks via sleek modal popups.
  - Quick-update task status via Drag-and-Drop (if using Kanban) or a simple dropdown.
- **Form Validation & Conflict Checking (Strict Zod/State checks):**
  - Throw explicit, user-friendly error messages if:
    - *Title Duplicate:* A task title already exists within this specific project.
    - *Past Deadline:* The selected due date is prior to the current date.
    - *Invalid Reassignment:* Prevent assigning modified properties if the status is locked incorrectly (e.g., "Completed tasks cannot be reassigned").
- **Task Drawer/Details:** Clicking a task opens a sliding right-hand sheet showing:
  - Task Title, Description, Priority (High/Med/Low), and Due Date.
  - **Comments System:** A nested timeline of messages where users can leave feedback.
  - **File Attachments:** A drag-and-drop placeholder zone allowing users to upload dummy attachments.

#### Page 5: Team Management (`/team`)
- A dashboard table showing all active team members, their roles (`Admin`, `Project Manager`, `Team Member`), and their current workload metrics.
- Action to "Invite/Add Member" to the platform or assign them to specific projects.

---

### 4. Advanced Filters, Productivity, & UX Features
- **Global & Local Controls:** Implement robust toolbar rows above data tables enabling:
  - Search inputs (filtering text by title, description, or member name).
  - Multi-select dropdown filters (by Project Status, Task Status, Priority, Assigned Member, and Deadline Status like "Overdue").
  - Sorting Dropdowns: Newest Created, Nearest Deadline, Highest Priority, and Recently Updated.
- **Pagination:** Implement clean bottom pagination controls or an infinite-scroll layout behavior for datasets exceeding 10 items.
- **Role-Based Access Control (RBAC) UI Handling:** - Conditionally disable or hide action buttons based on the logged-in demo user's role.
  - *Admin:* Sees and can click everything.
  - *Project Manager:* Can create/edit projects and assign tasks, but cannot access global system setting controls.
  - *Team Member:* "Create Project", "Delete Task", and team assignment buttons are visibly hidden or disabled. They can *only* edit the status of tasks explicitly assigned to them.

---

### 5. Output Expectations
Provide the layout structure, setup code, mock data arrays, component files, and Framer Motion animation configurations required to build this exact interface. Write clean, accessible TSX code incorporating Tailwind CSS classes.   