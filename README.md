# Task Management App (To-Do App)

## Overview

A full-stack Task Management application built with React (frontend) and Flask (backend). This application allows users to create, manage, and track tasks with features like priority levels, due dates, filtering, and searching.

![Task Management App](https://via.placeholder.com/800x400?text=Task+Management+App)

## Features

- **Task Management**: Create, edit, and delete tasks
- **Task Status**: Mark tasks as complete or incomplete
- **Priority Levels**: Assign low, medium, or high priority to tasks
- **Due Dates**: Set and track due dates for tasks
- **Filtering**: Filter tasks by status (all, active, completed)
- **Search**: Search for specific tasks
- **Statistics**: View task statistics (total, completed, pending, overdue)
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Mode**: Frontend fallback to local storage when API is unavailable

## Project Structure

This project consists of two main parts:

- **Frontend**: React application built with Vite
- **Backend**: Flask RESTful API with SQLite database

```
Task Management App (To-Do App)/
├── frontend/           # React frontend application
│   ├── src/            # Source files
│   ├── public/         # Static assets
│   ├── package.json    # Dependencies and scripts
│   └── README.md       # Frontend documentation
└── backend/            # Flask backend API
    ├── instance/       # SQLite database
    ├── main.py         # Main application file
    ├── requirement.txt # Dependencies
    └── README.md       # Backend documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- Python 3.12 or higher
- npm or yarn
- pip (Python package installer)

### Installation and Setup

#### Backend Setup

1. Navigate to the backend directory
   ```bash
   cd "Task Management App (To-Do App)/backend"
   ```

2. Create and activate a virtual environment
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirement.txt
   ```

4. Start the Flask server
   ```bash
   python main.py
   ```
   The API will be available at http://localhost:5000

#### Frontend Setup

1. Navigate to the frontend directory
   ```bash
   cd "Task Management App (To-Do App)/frontend"
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at http://localhost:5173

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Use the interface to create, edit, and manage your tasks
3. Tasks are automatically saved to the backend database
4. Use the filter and search features to find specific tasks
5. View task statistics to track your progress

## API Documentation

The backend provides a RESTful API for managing tasks. For detailed API documentation, please refer to the [Backend README](./backend/README.md).

## Technologies Used

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Lucide React (icons)
- PrimeReact & RSuite (UI components)

### Backend

- Flask
- Flask-SQLAlchemy
- Flask-CORS
- SQLite
- Werkzeug
- python-dotenv

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Updates
1. Add Notifications.
2. Add Reminders.
3. Add Voice Speking Task.
4. Add Controle With All Home Voice Assistance Devices.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Flask](https://flask.palletsprojects.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Lucide Icons](https://lucide.dev/)
- [PrimeReact](https://primereact.org/)
- [RSuite](https://rsuitejs.com/)
