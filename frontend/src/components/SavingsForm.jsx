import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, PiggyBank, Banknote, Calendar, FileText, Wallet } from 'lucide-react';
import { savingsAPI } from '../utils/api';
import { formatCurrency } from '../utils/currency';

function SavingsForm({ action = 'deposit', onClose, onSuccess, savingsBalance = 0, remainingBalance = 0 }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isWithdraw = action === 'withdraw';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount) {
      setError('Please add an amount before saving.');
      return;
    }

    const numericAmount = parseFloat(formData.amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Amount should be a positive number.');
      return;
    }

    if (isWithdraw && numericAmount > savingsBalance) {
      setError('Withdrawal amount exceeds your current savings balance.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        amount: numericAmount,
        action,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
      };
      await savingsAPI.createTransaction(payload);
      onSuccess?.();
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to record savings transaction.';
      setError(message);
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
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl ${
                isWithdraw
                  ? 'bg-semantic-danger/10 text-semantic-danger'
                  : 'bg-brand-accent/10 text-brand-accent'
              }`}
            >
              {isWithdraw ? <Banknote className="w-6 h-6" /> : <PiggyBank className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-dark dark:text-white">
                {isWithdraw ? 'Withdraw from Savings' : 'Add to Savings'}
              </h2>
              <p className="text-sm text-neutral-muted dark:text-neutral-light/70">
                {isWithdraw
                  ? 'Move funds from your savings back to remaining balance.'
                  : 'Reserve some of your remaining balance for future goals.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-primary rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="card bg-neutral-light dark:bg-brand-primary/30">
            <div className="flex items-center gap-3">
              <span className="badge-prefix bg-brand-accent/10 text-brand-accent">
                PKR
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-muted dark:text-neutral-light/70">
                  Savings Balance
                </p>
                <p className="text-lg font-semibold text-neutral-dark dark:text-white">
                  {formatCurrency(savingsBalance)}
                </p>
              </div>
            </div>
          </div>
          <div className="card bg-neutral-light dark:bg-brand-primary/30">
            <div className="flex items-center gap-3">
              <span className="badge-prefix bg-brand-accent/10 text-brand-accent">
                PKR
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-muted dark:text-neutral-light/70">
                  Remaining Balance
                </p>
                <p className="text-lg font-semibold text-neutral-dark dark:text-white">
                  {formatCurrency(remainingBalance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-semantic-danger/10 dark:bg-semantic-danger/20 border border-semantic-danger/40 dark:border-semantic-danger/40 rounded-xl text-semantic-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
              Amount (PKR)
            </label>
            <div className="relative">
              <span className="input-prefix">PKR</span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input-field input-with-icon"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-muted" />
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
            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-neutral-muted" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input-field textarea-with-icon resize-none"
                placeholder="Why are you adjusting the savings?"
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
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isWithdraw ? 'Withdraw' : 'Add to Savings'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default SavingsForm;
