# Task Management App (Backend)

## Overview

This is the backend API for the Task Management application. It provides RESTful endpoints for managing tasks, including creating, reading, updating, and deleting tasks, as well as filtering, searching, and retrieving task statistics.

## Features

- **RESTful API**: Standard CRUD operations for tasks
- **Filtering**: Filter tasks by status (all, completed, active)
- **Search**: Search tasks by text content
- **Priority Levels**: Support for task priority (low, medium, high)
- **Due Dates**: Support for task due dates
- **Statistics**: Endpoint for task statistics (total, completed, pending, overdue)
- **CORS Support**: Cross-Origin Resource Sharing enabled
- **SQLite Database**: Lightweight database for storing tasks

## Tech Stack

- **Flask**: Web framework (v2.3.3)
- **Flask-SQLAlchemy**: ORM for database operations (v3.0.5)
- **Flask-CORS**: CORS support for API (v4.0.0)
- **SQLite**: Database
- **Werkzeug**: WSGI utility library (v2.3.7)
- **python-dotenv**: Environment variable management (v1.0.0)

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd "Task Management App (To-Do App)/backend"
   ```

2. Create and activate a virtual environment (recommended)
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

4. Create a `.env` file in the backend directory (optional)
   ```
   DATABASE_URL=sqlite:///tasks.db
   SECRET_KEY=your-secret-key-here
   FLASK_ENV=development
   ```

## Running the Application

```bash
# Start the Flask server
python main.py
```

The API will be available at http://localhost:5000

## API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Endpoints

- **GET /** - API information and available endpoints
  
- **GET /api/tasks** - Get all tasks
  - Query parameters:
    - `filter`: Filter tasks by status (`all`, `completed`, `active`)
    - `search`: Search tasks by text
    - `priority`: Filter tasks by priority level
  
- **POST /api/tasks** - Create a new task
  - Request body:
    ```json
    {
      "text": "Task description",
      "priority": "medium",
      "dueDate": "2023-12-31"
    }
    ```
  
- **GET /api/tasks/:id** - Get a specific task
  
- **PUT /api/tasks/:id** - Update a task
  - Request body:
    ```json
    {
      "text": "Updated task description",
      "completed": true,
      "priority": "high",
      "dueDate": "2023-12-31"
    }
    ```
  
- **DELETE /api/tasks/:id** - Delete a task
  
- **GET /api/tasks/stats** - Get task statistics
  - Response:
    ```json
    {
      "total": 10,
      "completed": 5,
      "pending": 5,
      "overdue": 2
    }
    ```

## Database Schema

### Task Model

| Field      | Type      | Description                           |
|------------|-----------|---------------------------------------|
| id         | Integer   | Primary key                           |
| text       | String    | Task description                      |
| completed  | Boolean   | Task completion status                |
| priority   | String    | Task priority (low, medium, high)     |
| due_date   | Date      | Task due date                         |
| created_at | DateTime  | Timestamp when task was created       |
| updated_at | DateTime  | Timestamp when task was last updated  |

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format:

```json
{
  "error": "Error message description"
}
```

## Development

### Project Structure

```
backend/
├── instance/          # SQLite database files
│   └── tasks.db
├── venv/              # Virtual environment
├── main.py            # Main application file
├── requirement.txt    # Dependencies
└── .gitignore         # Git ignore file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Flask](https://flask.palletsprojects.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)