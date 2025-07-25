from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.exceptions import BadRequest

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///tasks.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)  # Enable CORS for all routes

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    priority = db.Column(db.String(10), default='medium', nullable=False)
    due_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'completed': self.completed,
            'priority': self.priority,
            'dueDate': self.due_date.isoformat() if self.due_date else None,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }

    def __repr__(self):
        return f'<Task {self.id}: {self.text}>'

# Create tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def index():
    return jsonify({
        'message': 'Task Management API',
        'version': '1.0.0',
        'endpoints': {
            'GET /api/tasks': 'Get all tasks',
            'POST /api/tasks': 'Create a new task',
            'GET /api/tasks/<id>': 'Get a specific task',
            'PUT /api/tasks/<id>': 'Update a task',
            'DELETE /api/tasks/<id>': 'Delete a task',
            'GET /api/tasks/stats': 'Get task statistics'
        }
    })

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks with optional filtering"""
    try:
        # Get query parameters
        filter_by = request.args.get('filter', 'all')  # all, completed, active
        search = request.args.get('search', '')
        priority = request.args.get('priority', '')
        
        # Build query
        query = Task.query
        
        # Apply filters
        if filter_by == 'completed':
            query = query.filter(Task.completed == True)
        elif filter_by == 'active':
            query = query.filter(Task.completed == False)
        
        if search:
            query = query.filter(Task.text.contains(search))
        
        if priority:
            query = query.filter(Task.priority == priority)
        
        # Order by created_at descending
        tasks = query.order_by(Task.created_at.desc()).all()
        
        return jsonify([task.to_dict() for task in tasks])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    try:
        data = request.get_json()
        
        if not data or not data.get('text'):
            return jsonify({'error': 'Task text is required'}), 400
        
        # Validate priority
        valid_priorities = ['low', 'medium', 'high']
        priority = data.get('priority', 'medium')
        if priority not in valid_priorities:
            return jsonify({'error': 'Invalid priority. Must be low, medium, or high'}), 400
        
        # Parse due date if provided
        due_date = None
        if data.get('dueDate'):
            try:
                due_date = datetime.strptime(data['dueDate'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid due date format. Use YYYY-MM-DD'}), 400
        
        # Create new task
        task = Task(
            text=data['text'].strip(),
            priority=priority,
            due_date=due_date,
            completed=data.get('completed', False)
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify(task.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Get a specific task"""
    try:
        task = Task.query.get_or_404(task_id)
        return jsonify(task.to_dict())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a specific task"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields if provided
        if 'text' in data:
            if not data['text'].strip():
                return jsonify({'error': 'Task text cannot be empty'}), 400
            task.text = data['text'].strip()
        
        if 'completed' in data:
            task.completed = bool(data['completed'])
        
        if 'priority' in data:
            valid_priorities = ['low', 'medium', 'high']
            if data['priority'] not in valid_priorities:
                return jsonify({'error': 'Invalid priority. Must be low, medium, or high'}), 400
            task.priority = data['priority']
        
        if 'dueDate' in data:
            if data['dueDate']:
                try:
                    task.due_date = datetime.strptime(data['dueDate'], '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({'error': 'Invalid due date format. Use YYYY-MM-DD'}), 400
            else:
                task.due_date = None
        
        task.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(task.to_dict())
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a specific task"""
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Task deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/stats', methods=['GET'])
def get_task_stats():
    """Get task statistics"""
    try:
        total_tasks = Task.query.count()
        completed_tasks = Task.query.filter(Task.completed == True).count()
        pending_tasks = total_tasks - completed_tasks
        
        # Priority breakdown
        high_priority = Task.query.filter(Task.priority == 'high').count()
        medium_priority = Task.query.filter(Task.priority == 'medium').count()
        low_priority = Task.query.filter(Task.priority == 'low').count()
        
        # Overdue tasks (due date is in the past and not completed)
        today = datetime.now().date()
        overdue_tasks = Task.query.filter(
            Task.due_date < today,
            Task.completed == False
        ).count()
        
        return jsonify({
            'total': total_tasks,
            'completed': completed_tasks,
            'pending': pending_tasks,
            'overdue': overdue_tasks,
            'by_priority': {
                'high': high_priority,
                'medium': medium_priority,
                'low': low_priority
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/bulk', methods=['PUT'])
def bulk_update_tasks():
    """Bulk update tasks (e.g., mark multiple as completed)"""
    try:
        data = request.get_json()
        
        if not data or 'task_ids' not in data or 'updates' not in data:
            return jsonify({'error': 'task_ids and updates are required'}), 400
        
        task_ids = data['task_ids']
        updates = data['updates']
        
        if not isinstance(task_ids, list) or len(task_ids) == 0:
            return jsonify({'error': 'task_ids must be a non-empty list'}), 400
        
        # Update tasks
        tasks = Task.query.filter(Task.id.in_(task_ids)).all()
        
        if len(tasks) != len(task_ids):
            return jsonify({'error': 'Some task IDs were not found'}), 404
        
        for task in tasks:
            if 'completed' in updates:
                task.completed = bool(updates['completed'])
            if 'priority' in updates:
                valid_priorities = ['low', 'medium', 'high']
                if updates['priority'] in valid_priorities:
                    task.priority = updates['priority']
            task.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': f'Updated {len(tasks)} tasks successfully',
            'updated_tasks': [task.to_dict() for task in tasks]
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request'}), 400

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)