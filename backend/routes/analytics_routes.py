from flask import Blueprint, request, jsonify
from models import db, Expense, Income, SavingsTransaction
from utils.jwt_helper import token_required
from datetime import datetime, timedelta
from sqlalchemy import func, extract

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/dashboard', methods=['GET'])
@token_required
def get_dashboard_analytics(current_user_id):
    """Get dashboard analytics including total income, expenses, and savings"""
    # Get date range (default to current month)
    now = datetime.utcnow()
    start_of_month = datetime(now.year, now.month, 1)
    
    # Determine previous month boundaries
    if now.month == 1:
        prev_month_year = now.year - 1
        prev_month = 12
    else:
        prev_month_year = now.year
        prev_month = now.month - 1

    start_of_prev_month = datetime(prev_month_year, prev_month, 1)
    end_of_prev_month = start_of_month - timedelta(seconds=1)

    # Calculate total income for current month
    total_income = db.session.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user_id,
        Income.date >= start_of_month
    ).scalar() or 0
    
    # Calculate total expenses for current month
    total_expenses = db.session.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user_id,
        Expense.date >= start_of_month
    ).scalar() or 0
    
    # Savings calculations - current month
    savings_deposits_month = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == current_user_id,
        SavingsTransaction.action == 'deposit',
        SavingsTransaction.date >= start_of_month
    ).scalar() or 0

    savings_withdrawals_month = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == current_user_id,
        SavingsTransaction.action == 'withdraw',
        SavingsTransaction.date >= start_of_month
    ).scalar() or 0

    savings_balance_month = savings_deposits_month - savings_withdrawals_month

    # Carryover calculations from previous months
    total_income_before = db.session.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user_id,
        Income.date < start_of_month
    ).scalar() or 0

    total_expenses_before = db.session.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user_id,
        Expense.date < start_of_month
    ).scalar() or 0

    savings_deposits_before = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == current_user_id,
        SavingsTransaction.action == 'deposit',
        SavingsTransaction.date < start_of_month
    ).scalar() or 0

    savings_withdrawals_before = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == current_user_id,
        SavingsTransaction.action == 'withdraw',
        SavingsTransaction.date < start_of_month
    ).scalar() or 0

    carryover_balance = (
        total_income_before
        - total_expenses_before
        - (savings_deposits_before - savings_withdrawals_before)
    )

    available_funds = carryover_balance + total_income

    # Calculate net savings (for historical reference)
    net_savings = total_income - total_expenses
    status = "Saved" if net_savings >= 0 else "Overspent"

    remaining_balance_month = available_funds - total_expenses - savings_balance_month
    
    # Get all-time totals
    all_time_income = db.session.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user_id
    ).scalar() or 0
    
    all_time_expenses = db.session.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user_id
    ).scalar() or 0

    all_time_savings_deposits = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == current_user_id,
        SavingsTransaction.action == 'deposit'
    ).scalar() or 0

    all_time_savings_withdrawals = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == current_user_id,
        SavingsTransaction.action == 'withdraw'
    ).scalar() or 0

    all_time_savings_balance = all_time_savings_deposits - all_time_savings_withdrawals
    all_time_remaining_balance = carryover_balance + (total_income - total_expenses - savings_balance_month)
    
    return jsonify({
        'current_month': {
            'total_income': round(total_income, 2),
            'total_expenses': round(total_expenses, 2),
            'net_savings': round(net_savings, 2),
            'status': status,
            'month': now.strftime('%B %Y'),
            'savings': {
                'total_deposits': round(savings_deposits_month, 2),
                'total_withdrawals': round(savings_withdrawals_month, 2),
                'balance': round(savings_balance_month, 2)
            },
            'remaining_balance': round(remaining_balance_month, 2),
            'available_funds': round(available_funds, 2),
            'carryover': {
                'amount': round(carryover_balance, 2),
                'label': end_of_prev_month.strftime('%B %Y'),
                'period_start': start_of_prev_month.isoformat(),
                'period_end': end_of_prev_month.isoformat()
            }
        },
        'all_time': {
            'total_income': round(all_time_income, 2),
            'total_expenses': round(all_time_expenses, 2),
            'net_savings': round(all_time_income - all_time_expenses, 2),
            'savings': {
                'total_deposits': round(all_time_savings_deposits, 2),
                'total_withdrawals': round(all_time_savings_withdrawals, 2),
                'balance': round(all_time_savings_balance, 2)
            },
            'remaining_balance': round(all_time_remaining_balance, 2)
        }
    }), 200

@analytics_bp.route('/analytics/category-breakdown', methods=['GET'])
@token_required
def get_category_breakdown(current_user_id):
    """Get expense breakdown by category"""
    # Get date range from query params
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = db.session.query(
        Expense.category,
        func.sum(Expense.amount).label('total')
    ).filter(Expense.user_id == current_user_id)
    
    if start_date:
        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(Expense.date >= start)
        except ValueError:
            pass
    
    if end_date:
        try:
            end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(Expense.date <= end)
        except ValueError:
            pass
    
    category_data = query.group_by(Expense.category).all()
    
    # Calculate total for percentage
    total_expenses = sum(item.total for item in category_data)
    
    breakdown = []
    for category, total in category_data:
        percentage = (total / total_expenses * 100) if total_expenses > 0 else 0
        breakdown.append({
            'category': category,
            'total': round(total, 2),
            'percentage': round(percentage, 2)
        })
    
    # Sort by total descending
    breakdown.sort(key=lambda x: x['total'], reverse=True)
    
    return jsonify({'breakdown': breakdown}), 200

@analytics_bp.route('/analytics/monthly-trend', methods=['GET'])
@token_required
def get_monthly_trend(current_user_id):
    """Get monthly trend for income, expenses, savings deposits, and leftover balance"""
    now = datetime.utcnow()
    months_count = 6
    current_month_start = datetime(now.year, now.month, 1)

    # Build list of month starts (oldest first)
    month_starts = []
    month_pointer = current_month_start
    for _ in range(months_count):
        month_starts.append(month_pointer)
        if month_pointer.month == 1:
            month_pointer = datetime(month_pointer.year - 1, 12, 1)
        else:
            month_pointer = datetime(month_pointer.year, month_pointer.month - 1, 1)
    month_starts.reverse()

    first_month_start = month_starts[0]

    # Aggregate monthly income
    income_data = db.session.query(
        extract('year', Income.date).label('year'),
        extract('month', Income.date).label('month'),
        func.sum(Income.amount).label('total')
    ).filter(
        Income.user_id == current_user_id,
        Income.date >= first_month_start
    ).group_by('year', 'month').all()

    # Aggregate monthly expenses
    expense_data = db.session.query(
        extract('year', Expense.date).label('year'),
        extract('month', Expense.date).label('month'),
        func.sum(Expense.amount).label('total')
    ).filter(
        Expense.user_id == current_user_id,
        Expense.date >= first_month_start
    ).group_by('year', 'month').all()

    # Aggregate monthly savings transactions by action
    savings_data = db.session.query(
        extract('year', SavingsTransaction.date).label('year'),
        extract('month', SavingsTransaction.date).label('month'),
        SavingsTransaction.action,
        func.sum(SavingsTransaction.amount).label('total')
    ).filter(
        SavingsTransaction.user_id == current_user_id,
        SavingsTransaction.date >= first_month_start
    ).group_by('year', 'month', SavingsTransaction.action).all()

    income_dict = {(int(year), int(month)): total for year, month, total in income_data}
    expense_dict = {(int(year), int(month)): total for year, month, total in expense_data}

    deposits_dict = {}
    withdrawals_dict = {}
    for year, month, action, total in savings_data:
        key = (int(year), int(month))
        if action == 'deposit':
            deposits_dict[key] = total
        elif action == 'withdraw':
            withdrawals_dict[key] = total

    # Calculate carryover balance prior to the first month in range
    income_before = db.session.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user_id,
        Income.date < first_month_start
    ).scalar() or 0

    expenses_before = db.session.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user_id,
        Expense.date < first_month_start
    ).scalar() or 0

    deposits_before = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == current_user_id,
        SavingsTransaction.action == 'deposit',
        SavingsTransaction.date < first_month_start
    ).scalar() or 0

    withdrawals_before = db.session.query(func.sum(SavingsTransaction.amount)).filter(
        SavingsTransaction.user_id == current_user_id,
        SavingsTransaction.action == 'withdraw',
        SavingsTransaction.date < first_month_start
    ).scalar() or 0

    carryover = income_before - expenses_before - (deposits_before - withdrawals_before)

    trend = []
    for month_start in month_starts:
        key = (month_start.year, month_start.month)
        month_income = income_dict.get(key, 0) or 0
        month_expenses = expense_dict.get(key, 0) or 0
        month_deposits = deposits_dict.get(key, 0) or 0
        month_withdrawals = withdrawals_dict.get(key, 0) or 0

        net_savings_transfer = month_deposits - month_withdrawals
        leftover = carryover + month_income - month_expenses - net_savings_transfer

        trend.append({
            'month': month_start.strftime('%b %Y'),
            'income': round(month_income, 2),
            'expenses': round(month_expenses, 2),
            'savings': round(month_deposits, 2),
            'leftover': round(leftover, 2)
        })

        carryover = leftover

    return jsonify({'trend': trend}), 200

@analytics_bp.route('/analytics/insights', methods=['GET'])
@token_required
def get_insights(current_user_id):
    """Get automated insights about spending and saving patterns"""
    insights = []
    now = datetime.utcnow()
    
    # Current month
    start_of_month = datetime(now.year, now.month, 1)
    current_month_income = db.session.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user_id,
        Income.date >= start_of_month
    ).scalar() or 0
    
    current_month_expenses = db.session.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user_id,
        Expense.date >= start_of_month
    ).scalar() or 0
    
    # Previous month
    if now.month == 1:
        prev_month = 12
        prev_year = now.year - 1
    else:
        prev_month = now.month - 1
        prev_year = now.year
    
    start_of_prev_month = datetime(prev_year, prev_month, 1)
    end_of_prev_month = start_of_month - timedelta(days=1)
    
    prev_month_income = db.session.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user_id,
        Income.date >= start_of_prev_month,
        Income.date <= end_of_prev_month
    ).scalar() or 0
    
    prev_month_expenses = db.session.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user_id,
        Expense.date >= start_of_prev_month,
        Expense.date <= end_of_prev_month
    ).scalar() or 0
    
    # Calculate savings comparison
    if prev_month_income > 0 and prev_month_expenses > 0:
        current_savings_rate = ((current_month_income - current_month_expenses) / current_month_income * 100) if current_month_income > 0 else 0
        prev_savings_rate = ((prev_month_income - prev_month_expenses) / prev_month_income * 100) if prev_month_income > 0 else 0
        
        if current_savings_rate > prev_savings_rate:
            diff = current_savings_rate - prev_savings_rate
            insights.append(f"Great job! You saved {abs(diff):.1f}% more this month compared to last month.")
        elif current_savings_rate < prev_savings_rate:
            diff = prev_savings_rate - current_savings_rate
            insights.append(f"Your savings decreased by {abs(diff):.1f}% this month. Consider reviewing your expenses.")
    
    # Category insights
    category_data = db.session.query(
        Expense.category,
        func.sum(Expense.amount).label('total')
    ).filter(
        Expense.user_id == current_user_id,
        Expense.date >= start_of_month
    ).group_by(Expense.category).all()
    
    if category_data and current_month_expenses > 0:
        top_category = max(category_data, key=lambda x: x.total)
        percentage = (top_category.total / current_month_expenses * 100)
        insights.append(f"{top_category.category} covers {percentage:.1f}% of your expenses this month.")
    
    # Spending trend
    if prev_month_expenses > 0:
        expense_change = ((current_month_expenses - prev_month_expenses) / prev_month_expenses * 100)
        if expense_change > 20:
            insights.append(f"Warning: Your spending increased by {expense_change:.1f}% this month.")
        elif expense_change < -20:
            insights.append(f"Excellent! You reduced spending by {abs(expense_change):.1f}% this month.")
    
    # Add default insight if none generated
    if not insights:
        if current_month_income > current_month_expenses:
            insights.append("You're on track! Keep up the good work managing your finances.")
        else:
            insights.append("Consider reviewing your expenses to improve your savings rate.")
    
    return jsonify({'insights': insights}), 200
