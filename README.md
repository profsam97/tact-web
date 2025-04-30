# Tact Web - Department Management Frontend

This repository hosts the frontend application for the Tact Department Management system, built with React (Vite + TypeScript). It provides a user interface for managing a hierarchy of departments and sub-departments, including user authentication.

#### please note first time, you access it and try to login, the request will
#### be slow, this is because render free tier sleeps the server when there
#### there is no interactivity 

You can access the frontend here: [render](https://tact-web.vercel.app/)


[Click here to jump to setup](#getting-started)

## Application Features

### Authentication & Authorization

-   **User Registration:** Allows new users to create an account (`/register`).
-   **User Login:** Secure login using username and password (`/login`). Uses JWT for session management via a corresponding backend API.
-   **Protected Routes:** The main dashboard (`/`) is only accessible to logged-in users. Unauthorized access redirects to the login page.
-   **Logout:** Functionality to clear the user's session and redirect to login.

### Department & Sub-Department Management

-   **Hierarchical View:** Departments and their associated sub-departments are displayed in a nested list structure on the dashboard.
-   **Expand/Collapse:** Parent departments can be expanded or collapsed to show/hide their sub-departments, animated with Framer Motion.
-   **Pagination:** The main department list is paginated (displaying 7 departments per page) with controls for navigation.
-   **CRUD Operations (Departments):**
    *   **Create:** Add new top-level departments, optionally including initial sub-departments during creation.
    *   **Update:** Edit the name of existing departments.
    *   **Delete:** Remove departments (and their associated sub-departments via backend cascade) with a confirmation dialog.
-   **CRUD Operations (Sub-Departments):**
    *   **Create (Standalone):** Add a new sub-department by selecting its parent department from a list.
    *   **Create/Update/Delete (within Edit):** When editing a parent department, users can add new sub-departments, update the names of existing ones, or remove them.

### User Interface & Experience

-   **Component Library:** Built using `shadcn/ui` for a consistent and modern look and feel (Cards, Dialogs, Forms, Buttons, Select, Pagination, etc.).
-   **Styling:** Tailwind CSS for utility-first styling.
-   **Responsiveness:** Basic responsiveness is handled by Tailwind and component structure (further refinement may be needed).
-   **Loading States:** Skeletons are displayed while data is being fetched.
-   **Empty States:** A helpful message and creation prompt are shown when no departments exist.
-   **Feedback:** Toast notifications (`Sonner`) provide feedback for actions like successful registration, creation, updates, deletions, and errors.
-   **Form Validation:** Uses `react-hook-form` and `zod` for client-side validation with user-friendly error messages.
-   **Animations:** Subtle animations (hover effects, list expansion) using Framer Motion enhance the user experience.

## Technical Implementation

### Frontend (`tact-web`)

-   **Framework/Library:** React (via Vite) with TypeScript.
-   **State Management:**
    *   **Global:** Zustand (for authentication token/user state).
    *   **Server Cache/Async State:** TanStack Query (React Query) (for managing API data fetching, caching, and mutations related to departments/sub-departments).
-   **Routing:** React Router DOM v6.
-   **UI Components:** `shadcn/ui`.
-   **Forms:** React Hook Form + Zod.
-   **API Communication:** `graphql-request` for GraphQL queries/mutations, standard `fetch` for REST authentication endpoints.
-   **Animation:** Framer Motion.
-   **Notifications:** Sonner.
-   **Icons:** Lucide React.

## Architecture

This frontend application interacts with a backend API:

1.  **Client Side (`tact-web`):**
    *   React frontend managing UI components and user interactions.
    *   Uses TanStack Query to fetch, cache, and update data from the API.
    *   Uses Zustand to manage global authentication state (JWT token).
    *   Handles routing with React Router.
    *   Makes requests to the backend API (`/graphql` for data, `/auth/*` for login/register).

2.  **Server Side (`tact-app` - External):**
    *   Handles business logic, database interactions (via Prisma), and authentication.
    *   Exposes GraphQL and REST endpoints.

3.  **Communication:**
    *   Standard HTTP requests (POST for GraphQL and Auth endpoints).
    *   JWT Bearer tokens are used for authorizing GraphQL requests.

## Getting Started

### Prerequisites

*   Node.js
*   npm (or yarn/pnpm)
*   **Backend API Running:** The corresponding backend API (`tact-app`) must be running and accessible (typically at `http://localhost:3000`).

### Clone the Repository

```bash
 git clone https://github.com/profsam97/tact-web.git
 cd tact-web
```

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

1.  **Ensure the Backend API is running.**
2.  Start the frontend development server:
    ```bash
    npm run dev
    ```
3.  Open your browser and navigate to the  [localhost](http://localhost:5173/graphql)  
## Technologies Used

*   **Core:** React, Vite, TypeScript
*   **UI:** shadcn/ui, Tailwind CSS, Radix UI (underlying primitive)
*   **State:** Zustand, TanStack Query (React Query) v5
*   **Routing:** React Router DOM v6
*   **Forms:** React Hook Form, Zod
*   **API Client:** graphql-request, fetch
*   **Animation:** Framer Motion
*   **Notifications:** Sonner
*   **Icons:** Lucide React
*   **Linting/Formatting:** ESLint, Prettier 
