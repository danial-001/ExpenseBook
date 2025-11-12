import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, Wallet, Lightbulb, Banknote, PiggyBank } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseForm from '../components/ExpenseForm';
import IncomeForm from '../components/IncomeForm';
import SavingsForm from '../components/SavingsForm';
import SavingsTable from '../components/SavingsTable';
import { expenseAPI, incomeAPI, analyticsAPI, savingsAPI } from '../utils/api';
import { setExpenses } from '../redux/expenseSlice';
import { setIncomes } from '../redux/incomeSlice';
import { setSavingsSummary } from '../redux/savingsSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const incomes = useSelector((state) => state.incomes.incomes);
  const savingsSummary = useSelector((state) => state.savings.summary);
  const savingsTransactions = useSelector((state) => state.savings.transactions);
  
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showSavingsForm, setShowSavingsForm] = useState(false);
  const [savingsAction, setSavingsAction] = useState('deposit');
  const [analytics, setAnalytics] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const statCards = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Total Income',
      value: analytics?.current_month.total_income || 0,
      subtitle: 'This month',
      color: 'success',
      delay: 0.1,
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: 'Total Expenses',
      value: analytics?.current_month.total_expenses || 0,
      subtitle: 'This month',
      color: 'danger',
      delay: 0.15,
    },
    {
      icon: (
        <span className="text-white">
          PKR
        </span>
      ),
      title: 'All-Time Savings',
      value: analytics?.all_time?.savings?.balance || 0,
      subtitle: 'Total manual savings to date',
      color: 'accent',
      delay: 0.2,
    },
    {
      icon: <Banknote className="w-6 h-6" />,
      title: 'Leftover Balance',
      value: analytics?.current_month?.carryover?.amount || 0,
      subtitle: `Retained from ${analytics?.current_month?.carryover?.label || 'previous month'}`,
      color: 'neutral',
      delay: 0.25,
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: 'Remaining Balance',
      value: analytics?.current_month?.remaining_balance || 0,
      subtitle: analytics?.current_month?.status || 'After expenses & savings',
      color: (analytics?.current_month?.remaining_balance || 0) >= 0 ? 'success' : 'danger',
      delay: 0.3,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      
      // Fetch all data in parallel
      const [
        expensesRes,
        incomesRes,
        analyticsRes,
        categoryRes,
        trendRes,
        insightsRes,
        savingsRes,
      ] = await Promise.all([
        expenseAPI.getAll(),
        incomeAPI.getAll(),
        analyticsAPI.getDashboard(),
        analyticsAPI.getCategoryBreakdown(),
        analyticsAPI.getMonthlyTrend(),
        analyticsAPI.getInsights(),
        savingsAPI.getSummary(),
      ]);

      dispatch(setExpenses(expensesRes.data.expenses));
      dispatch(setIncomes(incomesRes.data.incomes));
      dispatch(setSavingsSummary(savingsRes.data));
      setAnalytics(analyticsRes.data);
      setCategoryBreakdown(categoryRes.data.breakdown);
      setMonthlyTrend(trendRes.data.trend);
      setInsights(insightsRes.data.insights);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setShowExpenseForm(false);
    setShowIncomeForm(false);
    fetchData(false);
  };

  const handleSavingsSuccess = () => {
    setShowSavingsForm(false);
    fetchData(false);
  };

  const openSavingsForm = (actionType) => {
    setSavingsAction(actionType);
    setShowSavingsForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-dark-primary">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg-primary)]">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-[rgba(163,176,135,0.35)] via-[rgba(255,248,212,0.8)] to-[rgba(163,176,135,0.35)] flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-sm text-[color:var(--text-muted)]">{analytics?.current_month.month}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--text-primary)]">
              Financial Dashboard
            </h1>
            <p className="mt-2 max-w-lg text-sm text-[color:var(--text-muted)]">
              A concise snapshot of your income, spending, and savings health. Add new entries instantly from the quick actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-start md:justify-end">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowIncomeForm(true)}
              className="btn-secondary"
            >
              <Plus className="w-4 h-4" /> Add Income
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowExpenseForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </motion.button>
          </div>
        </motion.section>

        {/* Stat Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--text-muted)] uppercase tracking-[0.2em]">
              Key Metrics
            </h2>
          </div>
          <div className="metrics-grid">
            {statCards.map((card, idx) => (
              <StatCard key={idx} {...card} />
            ))}
          </div>
        </section>

        {/* Savings Controls */}
        <section className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">Savings Controls</h2>
              <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                Keep cash flow balanced by moving funds between spending and savings whenever needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openSavingsForm('deposit')}
                className="btn-secondary gap-2"
              >
                <span className="badge-prefix bg-brand-accent/15 text-brand-accent">PKR</span>
                Add to Savings
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openSavingsForm('withdraw')}
                className="btn-primary"
              >
                <Banknote className="w-4 h-4" /> Withdraw Savings
              </motion.button>
            </div>
          </div>
        </section>

        {/* Insights */}
        {insights.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-r from-[rgba(67,86,99,0.85)] via-[rgba(163,176,135,0.75)] to-[rgba(67,86,99,0.85)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Smart Insights</h3>
              </div>
              <ul className="space-y-2 text-sm sm:flex-1 sm:pl-3">
                {insights.map((insight, index) => (
                  <li key={index} className="opacity-90">
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        )}

        {/* Charts */}
        <section className="chart-grid">
          <ChartCard
            title="Monthly Trend"
            data={monthlyTrend}
            type="bar"
            delay={0.35}
          />
          <ChartCard
            title="Expense by Category"
            data={categoryBreakdown.map(item => ({
              name: item.category,
              total: item.total,
              percentage: item.percentage,
            }))}
            type="pie"
            delay={0.4}
          />
        </section>

        {/* Tables */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
            <ExpenseTable type="expense" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <ExpenseTable type="income" carryover={analytics?.current_month?.carryover} />
          </motion.div>
        </section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <SavingsTable summary={savingsSummary} transactions={savingsTransactions} />
        </motion.section>
      </main>

      {/* Modals */}
      {showExpenseForm && <ExpenseForm onClose={handleFormClose} />}
      {showIncomeForm && <IncomeForm onClose={handleFormClose} />}
      {showSavingsForm && (
        <SavingsForm
          action={savingsAction}
          onClose={() => setShowSavingsForm(false)}
          onSuccess={handleSavingsSuccess}
          savingsBalance={analytics?.all_time?.savings?.balance || 0}
          remainingBalance={analytics?.current_month?.remaining_balance || 0}
        />
      )}
    </div>
  );
}

export default Dashboard;
