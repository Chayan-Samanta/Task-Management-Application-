# Task Management App (Frontend)

## Overview

This is the frontend part of a full-stack Task Management application built with React and Vite. The application allows users to create, read, update, and delete tasks with various features like priority levels, due dates, filtering, and searching.

## Features

- **Task Management**: Create, edit, and delete tasks
- **Task Status**: Mark tasks as complete or incomplete
- **Priority Levels**: Assign low, medium, or high priority to tasks
- **Due Dates**: Set and track due dates for tasks
- **Filtering**: Filter tasks by status (all, active, completed)
- **Search**: Search for specific tasks
- **Statistics**: View task statistics (total, completed, pending, overdue)
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Mode**: Fallback to local storage when API is unavailable

## Tech Stack

- **React**: UI library (v19.1.0)
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **Lucide React**: Icon library
- **PrimeReact**: UI component library
- **RSuite**: UI component library

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Backend API running (see backend README for setup)

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd "Task Management App (To-Do App)/frontend"
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the frontend directory (optional)
   ```
   VITE_API_BASE=http://localhost:5000/api
   ```

## Available Scripts

- **Development server**
  ```bash
  npm run dev
  # or
  yarn dev
  ```
  Starts the development server at http://localhost:5173

- **Build for production**
  ```bash
  npm run build
  # or
  yarn build
  ```
  Builds the app for production to the `dist` folder

- **Preview production build**
  ```bash
  npm run preview
  # or
  yarn preview
  ```
  Locally preview the production build

- **Lint code**
  ```bash
  npm run lint
  # or
  yarn lint
  ```
  Run ESLint to check for code quality issues

## API Integration

The frontend communicates with the backend API running at `http://localhost:5000/api`. The main API endpoints used are:

- `GET /api/tasks`: Fetch all tasks (with optional filtering)
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update an existing task
- `DELETE /api/tasks/:id`: Delete a task
- `GET /api/tasks/stats`: Get task statistics

## Project Structure

```
frontend/
├── dist/               # Production build output
├── src/                # Source files
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## Dependencies

### Main Dependencies

- react: ^19.1.0
- react-dom: ^19.1.0
- axios: ^1.11.0
- tailwindcss: ^4.1.11
- lucide-react: ^0.525.0
- primereact: ^10.9.6
- rsuite: ^5.83.2

### Development Dependencies

- vite: ^7.0.4
- @vitejs/plugin-react: ^4.6.0
- eslint: ^9.30.1
- @types/react: ^19.1.8
- @types/react-dom: ^19.1.6

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [PrimeReact](https://primereact.org/)
- [RSuite](https://rsuitejs.com/)
