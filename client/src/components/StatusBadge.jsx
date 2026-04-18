import React from 'react';

const styles = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Accepted: 'bg-teal-100 text-teal-700 border-teal-200',
  Rejected: 'bg-red-100 text-red-600 border-red-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
};

const icons = { Pending: '⏳', Accepted: '✅', Rejected: '❌', Completed: '🏁' };

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      <span>{icons[status]}</span> {status}
    </span>
  );
}
