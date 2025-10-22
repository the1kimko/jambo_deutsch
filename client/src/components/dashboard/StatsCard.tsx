import React from 'react';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: 'orange' | 'blue' | 'green' | 'purple';
}

const colorStyles = {
  orange: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  green: { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
};

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, color }) => {
  const styles = colorStyles[color];
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className={`text-3xl font-bold ${styles.text}`}>{value}</p>
        </div>
        <div className={`text-5xl w-16 h-16 flex items-center justify-center rounded-full ${styles.bg} ${styles.text} border ${styles.border}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;