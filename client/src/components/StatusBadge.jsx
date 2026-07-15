import React from 'react';

const styles = {
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Accepted: 'bg-blue-50 text-blue-700 border-blue-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
  Completed: 'bg-green-50 text-green-700 border-green-200',
};

const icons = { Pending: '⏳', Accepted: '✅', Rejected: '❌', Completed: '🏁' };

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      <span>{icons[status]}</span> {status}
    </span>
  );
}
