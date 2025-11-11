import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

function ChartCard({ title, data, type = 'pie', delay = 0 }) {
  const COLORS = ['#A3B087', '#435663', '#FF8042', '#00C49F', '#FFBB28', '#FF6B6B'];
  const getViewportConfig = (width) => {
    if (width < 420) {
      return {
        chartHeight: 220,
        barSize: 36,
        barGap: 2,
        categoryGap: '10%',
        tickSize: 11,
        tickAngle: -45,
        tickDy: 10,
        xInterval: 0,
        bottomMargin: 18,
        pieRadius: 70,
        pieShowLabels: false,
      };
    }
    if (width < 640) {
      return {
        chartHeight: 240,
        barSize: 30,
        barGap: 4,
        categoryGap: '14%',
        tickSize: 11,
        tickAngle: -40,
        tickDy: 10,
        xInterval: 0,
        bottomMargin: 18,
        pieRadius: 85,
        pieShowLabels: false,
      };
    }
    if (width < 1024) {
      return {
        chartHeight: 280,
        barSize: 26,
        barGap: 8,
        categoryGap: '18%',
        tickSize: 12,
        tickAngle: -25,
        tickDy: 8,
        xInterval: 0,
        bottomMargin: 18,
        pieRadius: 100,
        pieShowLabels: true,
      };
    }
    return {
      chartHeight: 320,
      barSize: 24,
      barGap: 10,
      categoryGap: '22%',
      tickSize: 12,
      tickAngle: 0,
      tickDy: 0,
      xInterval: 0,
      bottomMargin: 18,
      pieRadius: 110,
      pieShowLabels: true,
    };
  };

  const [viewportConfig, setViewportConfig] = useState(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
    return getViewportConfig(width);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => {
      setViewportConfig(getViewportConfig(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatMonthLabel = (label) => {
    if (!label) return label;
    const parts = label.split(' ');
    if (parts.length === 2) {
      const month = parts[0].slice(0, 3);
      const year = parts[1].slice(-2);
      return `${month} ${year}`;
    }
    return label;
  };

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={viewportConfig.chartHeight - 20}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={viewportConfig.pieShowLabels ? ({ name, percentage }) => `${name}: ${percentage}%` : false}
                outerRadius={viewportConfig.pieRadius}
                fill="#8884d8"
                dataKey="total"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={viewportConfig.chartHeight}>
            <BarChart
              data={data}
              barGap={viewportConfig.barGap}
              barCategoryGap={viewportConfig.categoryGap}
              margin={{ bottom: viewportConfig.bottomMargin, left: 0, right: 0, top: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                tick={{
                  fill: '#6b7280',
                  fontSize: viewportConfig.tickSize,
                  angle: viewportConfig.tickAngle,
                  dy: viewportConfig.tickDy,
                }}
                tickMargin={12}
                interval={viewportConfig.xInterval}
                minTickGap={10}
                tickFormatter={formatMonthLabel}
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: viewportConfig.tickSize }}
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
                barSize={viewportConfig.barSize}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
                barSize={viewportConfig.barSize}
              />
              <Bar
                dataKey="savings"
                name="Savings"
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
                barSize={viewportConfig.barSize}
              />
              <Bar
                dataKey="leftover"
                name="Leftover"
                fill="#facc15"
                radius={[8, 8, 0, 0]}
                barSize={viewportConfig.barSize}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={viewportConfig.chartHeight - 10}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                tick={{
                  fill: '#6b7280',
                  fontSize: viewportConfig.tickSize,
                  angle: viewportConfig.tickAngle,
                  dy: viewportConfig.tickDy,
                }}
                tickFormatter={formatMonthLabel}
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
                interval={viewportConfig.xInterval}
                minTickGap={10}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: viewportConfig.tickSize }}
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line type="monotone" dataKey="income" stroke="#A3B087" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="expenses" stroke="#FF6B6B" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="savings" stroke="#00C49F" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const legendItems = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (type === 'pie') {
      const total = data.reduce((acc, item) => acc + (item.total || 0), 0);
      return data.map((item, index) => {
        const value = item.total || 0;
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        return {
          label: item.name || `Item ${index + 1}`,
          color: COLORS[index % COLORS.length],
          meta: `${percentage}%`,
        };
      });
    }

    return [
      { label: 'Income', color: '#22c55e' },
      { label: 'Expenses', color: '#ef4444' },
      { label: 'Savings', color: '#8b5cf6' },
      { label: 'Leftover', color: '#facc15' },
    ];
  }, [data, type]);

  const chartContent = data && data.length > 0
    ? renderChart()
    : (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-gray-400 dark:text-gray-600">No data available</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card"
    >
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">{title}</h3>
      {chartContent}

      {legendItems.length > 0 && (
        <div className="chart-legend">
          {legendItems.map((item) => (
            <div key={item.label} className="chart-legend__item">
              <span className="chart-legend__dot" style={{ backgroundColor: item.color }} />
              <span className="chart-legend__label">{item.label}</span>
              {item.meta && <span className="chart-legend__meta">{item.meta}</span>}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default ChartCard;
