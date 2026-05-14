import type { ReactNode } from 'react';

export function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      <div className="section-label">{children}</div>
      {right}
    </div>
  );
}
