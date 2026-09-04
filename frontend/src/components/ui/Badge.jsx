import React from 'react';

const STATUS_MAP = {
  pending:    { label: '⏳ Chờ xử lý',   cls: 'badge-pending' },
  processing: { label: '🔄 Đang xử lý',  cls: 'badge-processing' },
  resolved:   { label: '✅ Đã giải quyết', cls: 'badge-resolved' },
  rejected:   { label: '❌ Từ chối',      cls: 'badge-rejected' },
};

const PRIORITY_MAP = {
  'cao':       { label: '🔴 Ưu tiên cao',    cls: 'badge-priority-cao' },
  'trung bình':{ label: '🟡 Trung bình',     cls: 'badge-priority-trung-binh' },
  'thấp':      { label: '⚪ Thấp',           cls: 'badge-priority-thap' },
};

export function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: 'badge-pending' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export function PriorityBadge({ priority }) {
  if (!priority) return null;
  const p = PRIORITY_MAP[priority.toLowerCase()] || { label: priority, cls: 'badge-priority-thap' };
  return <span className={`badge ${p.cls}`}>{p.label}</span>;
}
