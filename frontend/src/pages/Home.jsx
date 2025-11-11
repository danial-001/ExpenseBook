import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, DollarSign, Shield, Zap, BarChart3 } from 'lucide-react';

function Home() {
  const features = [
    {
      icon: <DollarSign className="w-8 h-8 text-brand-accent" />,
      title: 'Track Expenses',
      description: 'Easily log and categorize all your expenses in one place',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-brand-accent" />,
      title: 'Monitor Income',
      description: 'Keep track of all your income sources and cash flow',
    },
    {
      icon: <PieChart className="w-8 h-8 text-brand-accent" />,
      title: 'Visual Analytics',
      description: 'Beautiful charts and graphs to understand your spending',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-brand-accent" />,
      title: 'Smart Insights',
      description: 'Get automated insights about your financial patterns',
    },
    {
      icon: <Shield className="w-8 h-8 text-brand-accent" />,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and secure',
    },
    {
      icon: <Zap className="w-8 h-8 text-brand-accent" />,
      title: 'Fast & Easy',
      description: 'Quick entry and intuitive interface for daily use',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-surface to-brand-primary text-light-primary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-light-primary mb-6">
            Take Control of Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-accentMuted to-brand-accent"> Finances</span>
          </h1>
          <p className="text-xl text-brand-accentMuted/90 mb-10">
            Track expenses, monitor income, and make smarter financial decisions with our intuitive expense tracker
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8 py-4 text-lg"
              >
                Get Started Free
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-8 py-4 text-lg"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="card hover:shadow-2xl cursor-pointer text-left"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-accent/12 text-brand-accent shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-muted dark:text-neutral-light/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="card max-w-3xl mx-auto bg-gradient-to-r from-brand-accent to-brand-accentMuted text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Tracking?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of users who are taking control of their financial future
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-brand-accent px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                Create Your Free Account
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
