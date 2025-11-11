from flask import Blueprint, request, jsonify
from datetime import datetime
from sqlalchemy import func

from models import db, SavingsTransaction
from utils.jwt_helper import token_required

savings_bp = Blueprint('savings', __name__)


def _get_all_time_savings(user_id):
    deposits = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == user_id,
        SavingsTransaction.action == 'deposit'
    ).scalar() or 0

    withdrawals = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == user_id,
        SavingsTransaction.action == 'withdraw'
    ).scalar() or 0

    return {
        'deposits': deposits,
        'withdrawals': withdrawals,
        'balance': deposits - withdrawals
    }


def _get_current_month_savings(user_id):
    now = datetime.utcnow()
    start_of_month = datetime(now.year, now.month, 1)

    deposits = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == user_id,
        SavingsTransaction.action == 'deposit',
        SavingsTransaction.date >= start_of_month
    ).scalar() or 0

    withdrawals = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == user_id,
        SavingsTransaction.action == 'withdraw',
        SavingsTransaction.date >= start_of_month
    ).scalar() or 0

    return {
        'deposits': deposits,
        'withdrawals': withdrawals,
        'balance': deposits - withdrawals,
        'month': start_of_month.strftime('%B %Y')
    }


@savings_bp.route('/savings', methods=['GET'])
@token_required
def get_savings(current_user_id):
    """Get savings transactions and summary"""
    transactions = SavingsTransaction.query.filter_by(user_id=current_user_id).order_by(
        SavingsTransaction.date.desc()
    ).all()

    all_time = _get_all_time_savings(current_user_id)
    current_month = _get_current_month_savings(current_user_id)

    return jsonify({
        'summary': {
            'all_time': {
                'total_deposits': round(all_time['deposits'], 2),
                'total_withdrawals': round(all_time['withdrawals'], 2),
                'balance': round(all_time['balance'], 2)
            },
            'current_month': {
                'total_deposits': round(current_month['deposits'], 2),
                'total_withdrawals': round(current_month['withdrawals'], 2),
                'balance': round(current_month['balance'], 2),
                'label': current_month['month']
            }
        },
        'transactions': [tx.to_dict() for tx in transactions]
    }), 200


@savings_bp.route('/savings', methods=['POST'])
@token_required
def create_savings_transaction(current_user_id):
    """Create a savings transaction (deposit or withdraw)"""
    data = request.get_json() or {}

    amount = data.get('amount')
    action = data.get('action')
    description = data.get('description', '')
    date_value = data.get('date')

    if not amount or not action:
        return jsonify({'error': 'Amount and action are required'}), 400

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify({'error': 'Amount must be a valid number'}), 400

    if amount <= 0:
        return jsonify({'error': 'Amount must be greater than zero'}), 400

    action = action.lower()
    if action not in ('deposit', 'withdraw'):
        return jsonify({'error': "Action must be either 'deposit' or 'withdraw'"}), 400

    # Parse date if provided
    tx_date = datetime.utcnow()
    if date_value:
        try:
            tx_date = datetime.fromisoformat(date_value.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400

    all_time = _get_all_time_savings(current_user_id)
    current_balance = all_time['balance']

    if action == 'withdraw' and amount > current_balance:
        return jsonify({'error': 'Insufficient savings balance for withdrawal'}), 400

    transaction = SavingsTransaction(
        user_id=current_user_id,
        amount=amount,
        action=action,
        description=description,
        date=tx_date
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        'message': 'Savings transaction recorded successfully',
        'transaction': transaction.to_dict()
    }), 201
