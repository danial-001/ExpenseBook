import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { PiggyBank, Banknote } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

function SavingsTable({ summary, transactions }) {
  const monthLabel = summary?.current_month?.label || '';

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Savings Overview</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Track your manual savings adjustments and see how funds move in and out of savings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-gray-50 dark:bg-dark-primary">
          <div className="flex items-center gap-3">
            <span className="badge-prefix bg-green-500/10 text-green-600">
              PKR
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {monthLabel || 'Current Month'} Deposits
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {formatCurrency(summary?.current_month?.total_deposits || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-gray-50 dark:bg-dark-primary">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {monthLabel || 'Current Month'} Withdrawals
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {formatCurrency(summary?.current_month?.total_withdrawals || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-gray-50 dark:bg-dark-primary">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Savings Balance
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {formatCurrency(summary?.all_time?.balance || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {transactions?.length ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Action</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Description</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-primary transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                    {format(new Date(tx.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tx.action === 'deposit'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {tx.action === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {tx.description || '-'}
                  </td>
                  <td
                    className={`py-3 px-4 text-right text-sm font-semibold ${
                      tx.action === 'deposit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {tx.action === 'withdraw' ? '-' : '+'}
                    {formatCurrency(tx.amount)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No savings transactions recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default SavingsTable;
