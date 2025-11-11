from flask import Blueprint, request, jsonify
from models import db, Expense
from utils.jwt_helper import token_required
from datetime import datetime

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/expenses', methods=['GET'])
@token_required
def get_expenses(current_user_id):
    """Get all expenses for current user"""
    # Get query parameters for filtering
    category = request.args.get('category')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Build query
    query = Expense.query.filter_by(user_id=current_user_id)
    
    if category:
        query = query.filter_by(category=category)
    
    if start_date:
        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(Expense.date >= start)
        except ValueError:
            return jsonify({'error': 'Invalid start_date format'}), 400
    
    if end_date:
        try:
            end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(Expense.date <= end)
        except ValueError:
            return jsonify({'error': 'Invalid end_date format'}), 400
    
    expenses = query.order_by(Expense.date.desc()).all()
    
    return jsonify({
        'expenses': [expense.to_dict() for expense in expenses]
    }), 200

@expense_bp.route('/expenses', methods=['POST'])
@token_required
def create_expense(current_user_id):
    """Create a new expense"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('amount') or not data.get('category'):
        return jsonify({'error': 'Amount and category are required'}), 400
    
    # Validate category
    valid_categories = ['Food', 'Rent', 'Travel', 'Misc.', 'Others']
    if data['category'] not in valid_categories:
        return jsonify({'error': f'Category must be one of: {", ".join(valid_categories)}'}), 400
    
    # Parse date if provided
    expense_date = datetime.utcnow()
    if data.get('date'):
        try:
            expense_date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
    
    # Create expense
    expense = Expense(
        user_id=current_user_id,
        amount=float(data['amount']),
        category=data['category'],
        description=data.get('description', ''),
        date=expense_date
    )
    
    db.session.add(expense)
    db.session.commit()
    
    return jsonify({
        'message': 'Expense created successfully',
        'expense': expense.to_dict()
    }), 201

@expense_bp.route('/expenses/<int:expense_id>', methods=['PUT'])
@token_required
def update_expense(current_user_id, expense_id):
    """Update an expense"""
    expense = Expense.query.filter_by(id=expense_id, user_id=current_user_id).first()
    
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    
    data = request.get_json()
    
    # Update fields
    if data.get('amount'):
        expense.amount = float(data['amount'])
    
    if data.get('category'):
        valid_categories = ['Food', 'Rent', 'Travel', 'Misc.', 'Others']
        if data['category'] not in valid_categories:
            return jsonify({'error': f'Category must be one of: {", ".join(valid_categories)}'}), 400
        expense.category = data['category']
    
    if 'description' in data:
        expense.description = data['description']
    
    if data.get('date'):
        try:
            expense.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
    
    db.session.commit()
    
    return jsonify({
        'message': 'Expense updated successfully',
        'expense': expense.to_dict()
    }), 200

@expense_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
@token_required
def delete_expense(current_user_id, expense_id):
    """Delete an expense"""
    expense = Expense.query.filter_by(id=expense_id, user_id=current_user_id).first()
    
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    
    db.session.delete(expense)
    db.session.commit()
    
    return jsonify({'message': 'Expense deleted successfully'}), 200
