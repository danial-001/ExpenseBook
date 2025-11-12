import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { X, Tag, Calendar, FileText, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { expenseAPI } from '../utils/api';
import { addExpense, updateExpense } from '../redux/expenseSlice';

function ExpenseForm({ onClose, expense = null, remainingBalance = null }) {
  const isEdit = !!expense;
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    amount: expense?.amount || '',
    category: expense?.category || 'Food',
    description: expense?.description || '',
    date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizedRemaining = typeof remainingBalance === 'number' ? remainingBalance : null;
  const existingAmount = Number(expense?.amount ?? 0);
  const allowableBudget = normalizedRemaining !== null ? normalizedRemaining + (isEdit ? existingAmount : 0) : null;
  const currentAmount = parseFloat(formData.amount || '0');
  const exceedsBudget = allowableBudget !== null && currentAmount > allowableBudget;
  const noFundsForNew = !isEdit && normalizedRemaining !== null && normalizedRemaining <= 0;
  const displayRemaining = normalizedRemaining !== null ? Math.max(normalizedRemaining, 0) : null;
  const displayBudgetCap = allowableBudget !== null ? Math.max(allowableBudget, 0) : null;

  const categories = ['Food', 'Rent', 'Travel', 'Misc.', 'Others'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const numericAmount = parseFloat(formData.amount);

      if (Number.isNaN(numericAmount) || numericAmount <= 0) {
        setError('Amount should be a positive number.');
        setLoading(false);
        return;
      }

      if (allowableBudget !== null && numericAmount > allowableBudget) {
        setError(`This expense exceeds your available balance. You can spend up to ${formatCurrency(displayBudgetCap || 0)}.`);
        setLoading(false);
        return;
      }

      if (isEdit) {
        const response = await expenseAPI.update(expense.id, formData);
        dispatch(updateExpense(response.data.expense));
      } else {
        const response = await expenseAPI.create(formData);
        dispatch(addExpense(response.data.expense));
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isEdit ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-primary rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (PKR)
            </label>
            <div className="relative">
              <span className="input-prefix">PKR</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="input-field input-with-icon"
                placeholder="0.00"
                required
                disabled={noFundsForNew}
              />
            </div>
            {normalizedRemaining !== null && (
              <p className="mt-2 text-xs font-medium text-neutral-muted dark:text-neutral-light/70">
                {isEdit
                  ? `You can adjust this expense up to ${formatCurrency(displayBudgetCap || 0)}.`
                  : `Remaining balance: ${formatCurrency(displayRemaining || 0)}.`}
              </p>
            )}
            {exceedsBudget && (
              <p className="mt-1 text-xs font-semibold text-semantic-danger">
                Amount exceeds your available balance. Lower the value to continue.
              </p>
            )}
            {noFundsForNew && (
              <p className="mt-1 text-xs font-semibold text-semantic-danger text-white">
                Remaining balance is zero. Add income or withdraw savings before recording new expenses.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field input-with-icon appearance-none pr-12"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field input-with-icon"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input-field textarea-with-icon resize-none"
                placeholder="Add a note..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || exceedsBudget || noFundsForNew}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Expense'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default ExpenseForm;
