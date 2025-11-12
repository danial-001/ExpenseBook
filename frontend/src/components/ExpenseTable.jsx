import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { expenseAPI, incomeAPI } from '../utils/api';
import { deleteExpense } from '../redux/expenseSlice';
import { deleteIncome } from '../redux/incomeSlice';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';
import { formatCurrency } from '../utils/currency';

function ExpenseTable({ type = 'expense', carryover = null }) {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const incomes = useSelector((state) => state.incomes.incomes);
  
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const isExpense = type === 'expense';
  const data = isExpense ? expenses : incomes;
  const PAGE_SIZE = 5;
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [type]);

  useEffect(() => {
    if ((page - 1) * PAGE_SIZE >= data.length && page > 1) {
      setPage(Math.max(1, Math.ceil(data.length / PAGE_SIZE)));
    }
  }, [data.length, page]);

  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedData = data.slice(startIndex, startIndex + PAGE_SIZE);

  const filledRows = [...paginatedData];
  while (filledRows.length < PAGE_SIZE) {
    filledRows.push(null);
  }

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      if (type === 'expense') {
        await expenseAPI.delete(id);
        dispatch(deleteExpense(id));
      } else {
        await incomeAPI.delete(id);
        dispatch(deleteIncome(id));
      }
    } catch (err) {
      alert(`Failed to delete ${type}`);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      Rent: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      Travel: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Misc.': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      Others: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[category] || colors['Others'];
  };

  return (
    <>
      <div className="card flex flex-col min-h-[360px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-white">
            Recent {type === 'expense' ? 'Expenses' : 'Income'}
          </h2>
        </div>

        {data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 mb-4 rounded-full border-2 border-neutral-muted/40 dark:border-brand-primary/50 flex items-center justify-center text-neutral-muted font-semibold">
              PKR
            </div>
            <p className="text-neutral-muted dark:text-neutral-light/70">No {type === 'expense' ? 'expenses' : 'income'} recorded yet</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <div className="pr-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-muted dark:border-brand-surface/80">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-muted dark:text-neutral-light/70">
                        Date
                      </th>
                      {isExpense ? (
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-muted dark:text-neutral-light/70">
                          Category
                        </th>
                      ) : (
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-muted dark:text-neutral-light/70">
                          Source
                        </th>
                      )}
                      {isExpense && (
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-muted dark:text-neutral-light/70">
                          Description
                        </th>
                      )}
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-muted dark:text-neutral-light/70">
                        Amount
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-muted dark:text-neutral-light/70">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {type === 'income' && carryover?.amount !== undefined && page === 1 && (
                      <motion.tr
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="border-b border-neutral-muted/70 dark:border-brand-surface/70 bg-brand-accent/5 dark:bg-brand-primary/30"
                      >
                        <td className="py-3 px-4 text-sm text-neutral-dark dark:text-neutral-light">
                          {carryover.period_end
                            ? new Date(carryover.period_end).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                            : carryover.label}
                        </td>
                        <td
                          className="py-3 px-4 text-sm text-neutral-dark dark:text-neutral-light"
                          colSpan={type === 'expense' ? 2 : 1}
                        >
                          Remaining balance from {carryover.label}
                        </td>
                        {isExpense && (
                          <td className="py-3 px-4 text-sm text-neutral-muted dark:text-neutral-light/70">-</td>
                        )}
                        <td className="py-3 px-4 text-right text-sm font-semibold text-brand-accent dark:text-brand-accent">
                          {formatCurrency(carryover.amount || 0)}
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-neutral-muted dark:text-neutral-light/60">—</td>
                      </motion.tr>
                    )}
                    {filledRows.map((item, index) => {
                      if (!item) {
                        return (
                          <tr
                            key={`placeholder-${index}`}
                            className="border-b border-neutral-muted/40 dark:border-brand-surface/40 h-12"
                          >
                            <td className="py-3 px-4" colSpan={isExpense ? 5 : 4}>
                              &nbsp;
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-neutral-muted/60 dark:border-brand-surface/60 hover:bg-neutral-light/80 dark:hover:bg-brand-primary/40 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-neutral-dark dark:text-neutral-light">
                            {format(new Date(item.date), 'MMM dd, yyyy')}
                          </td>
                          {isExpense ? (
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                {item.category}
                              </span>
                            </td>
                          ) : (
                            <td className="py-3 px-4 text-sm text-neutral-dark dark:text-neutral-light">
                              {item.source}
                            </td>
                          )}
                          {isExpense && (
                            <td className="py-3 px-4 text-sm text-neutral-muted dark:text-neutral-light/70 max-w-xs truncate">
                              {item.description || '-'}
                            </td>
                          )}
                          <td className="py-3 px-4 text-right text-sm font-semibold text-neutral-dark dark:text-white">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-brand-accent hover:bg-brand-accent/10 dark:hover:bg-brand-primary/50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-semantic-danger hover:bg-semantic-danger/10 dark:hover:bg-semantic-danger/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {data.length > PAGE_SIZE && (
              <div className="mt-auto pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-sm text-neutral-muted dark:text-neutral-light/70">
                    Showing {startIndex + 1}-{Math.min(data.length, startIndex + PAGE_SIZE)} of {data.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-full border border-neutral-muted/60 dark:border-brand-surface/60 text-sm font-medium text-neutral-dark dark:text-neutral-light disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-light/80 dark:hover:bg-brand-primary/40 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                          page === pageNumber
                            ? 'bg-brand-accent text-white shadow-sm'
                            : 'text-neutral-dark dark:text-neutral-light hover:bg-neutral-light/70 dark:hover:bg-brand-primary/40'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-full border border-neutral-muted/60 dark:border-brand-surface/60 text-sm font-medium text-neutral-dark dark:text-neutral-light disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-light/80 dark:hover:bg-brand-primary/40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        type === 'expense' ? (
          <ExpenseForm
            expense={editingItem}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        ) : (
          <IncomeForm
            income={editingItem}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        )
      )}
    </>
  );
}

export default ExpenseTable;
