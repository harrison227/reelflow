import type { ColumnId } from '@/lib/mock-data';
import { COLUMNS } from '@/lib/mock-data';

const STATUS_COLORS: Record<ColumnId, { c: string; bg: string }> = {
  brief: { c: 'var(--fg-dim)', bg: 'rgba(127,127,127,0.08)' },
  footage: { c: '#a0824b', bg: 'rgba(202,165,106,0.14)' },
  editing: { c: '#5a8aac', bg: 'rgba(122,167,201,0.14)' },
  review: { c: 'var(--fg)', bg: 'rgba(127,127,127,0.12)' },
  revisions: { c: '#b87773', bg: 'rgba(208,150,144,0.14)' },
  approved: { c: '#5fa073', bg: 'rgba(131,184,143,0.14)' },
  delivered: { c: 'var(--fg-mute)', bg: 'rgba(127,127,127,0.06)' },
};

export function StatusChip({ status }: { status: ColumnId }) {
  const col = COLUMNS.find((c) => c.id === status);
  const s = STATUS_COLORS[status];
  return (
    <span className="chip status" style={{ color: s.c, background: s.bg, borderColor: 'transparent' }}>
      {col ? col.name : status}
    </span>
  );
}
