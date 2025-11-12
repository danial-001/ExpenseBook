import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/currency';

function StatCard({ icon, title, value, subtitle, color = 'accent', delay = 0 }) {
  const colorConfig = {
    accent: {
      gradient: 'from-dark-accent to-light-surface',
      iconBg: 'bg-gradient-to-br from-dark-accent to-light-surface',
      iconText: 'text-dark-bg',
      glow: 'group-hover:shadow-glow-light dark:group-hover:shadow-glow-dark',
    },
    success: {
      gradient: 'from-semantic-success to-emerald-400',
      iconBg: 'bg-gradient-to-br from-semantic-success to-emerald-400',
      iconText: 'text-white',
      glow: 'group-hover:shadow-[0_0_20px_rgba(22,163,74,0.5)]',
    },
    warning: {
      gradient: 'from-semantic-warning to-amber-400',
      iconBg: 'bg-gradient-to-br from-semantic-warning to-amber-400',
      iconText: 'text-white',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    },
    danger: {
      gradient: 'from-semantic-danger to-red-500',
      iconBg: 'bg-gradient-to-br from-semantic-danger to-red-500',
      iconText: 'text-white',
      glow: 'group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]',
    },
    neutral: {
      gradient: 'from-light-accent to-dark-surface',
      iconBg: 'bg-gradient-to-br from-light-accent to-dark-surface',
      iconText: 'text-light-bg',
      glow: 'group-hover:shadow-soft-lg',
    },
  };

  const config = colorConfig[color] || colorConfig.accent;

  const formatValue = (val) => {
    if (typeof val !== 'number') return val;
    return formatCurrency(val);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="relative overflow-hidden rounded-[22px] border border-[rgba(67,86,99,0.12)] bg-white/95 px-4 py-4 shadow-[0px_12px_32px_rgba(49,54,71,0.1)] transition-all duration-300 hover:shadow-[0px_18px_40px_rgba(49,54,71,0.14)] sm:rounded-[24px] sm:px-6 sm:py-6 dark:bg-[rgba(49,54,71,0.82)] dark:border-[rgba(163,176,135,0.28)]"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[rgba(163,176,135,0.65)] via-[rgba(67,86,99,0.35)] to-[rgba(163,176,135,0.65)]" />

      <div className="relative z-10 space-y-4 sm:space-y-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-2xl ${config.iconBg} ${config.glow} transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10`}
          >
            <div className={`flex items-center justify-center ${config.iconText}`}>{icon}</div>
          </div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-text-muted sm:text-[0.68rem]">
            {title}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[1.4rem] font-semibold leading-tight text-text-primary sm:text-[1.75rem]">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-[0.62rem] text-text-muted sm:text-xs">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
