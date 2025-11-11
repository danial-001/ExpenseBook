from flask import Blueprint, request, jsonify
from models import db, Income
from utils.jwt_helper import token_required
from datetime import datetime

income_bp = Blueprint('income', __name__)

@income_bp.route('/incomes', methods=['GET'])
@token_required
def get_incomes(current_user_id):
    """Get all incomes for current user"""
    # Get query parameters for filtering
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Build query
    query = Income.query.filter_by(user_id=current_user_id)
    
    if start_date:
        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(Income.date >= start)
        except ValueError:
            return jsonify({'error': 'Invalid start_date format'}), 400
    
    if end_date:
        try:
            end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(Income.date <= end)
        except ValueError:
            return jsonify({'error': 'Invalid end_date format'}), 400
    
    incomes = query.order_by(Income.date.desc()).all()
    
    return jsonify({
        'incomes': [income.to_dict() for income in incomes]
    }), 200

@income_bp.route('/incomes', methods=['POST'])
@token_required
def create_income(current_user_id):
    """Create a new income"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('amount') or not data.get('source'):
        return jsonify({'error': 'Amount and source are required'}), 400
    
    # Parse date if provided
    income_date = datetime.utcnow()
    if data.get('date'):
        try:
            income_date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
    
    # Create income
    income = Income(
        user_id=current_user_id,
        source=data['source'],
        amount=float(data['amount']),
        date=income_date
    )
    
    db.session.add(income)
    db.session.commit()
    
    return jsonify({
        'message': 'Income created successfully',
        'income': income.to_dict()
    }), 201

@income_bp.route('/incomes/<int:income_id>', methods=['PUT'])
@token_required
def update_income(current_user_id, income_id):
    """Update an income"""
    income = Income.query.filter_by(id=income_id, user_id=current_user_id).first()
    
    if not income:
        return jsonify({'error': 'Income not found'}), 404
    
    data = request.get_json()
    
    # Update fields
    if data.get('amount'):
        income.amount = float(data['amount'])
    
    if data.get('source'):
        income.source = data['source']
    
    if data.get('date'):
        try:
            income.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
    
    db.session.commit()
    
    return jsonify({
        'message': 'Income updated successfully',
        'income': income.to_dict()
    }), 200

@income_bp.route('/incomes/<int:income_id>', methods=['DELETE'])
@token_required
def delete_income(current_user_id, income_id):
    """Delete an income"""
    income = Income.query.filter_by(id=income_id, user_id=current_user_id).first()
    
    if not income:
        return jsonify({'error': 'Income not found'}), 404
    
    db.session.delete(income)
    db.session.commit()
    
    return jsonify({'message': 'Income deleted successfully'}), 200
