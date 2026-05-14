import { Suspense } from 'react';
import { BoardView } from '@/components/board/BoardView';

export default function BoardPage() {
  return (
    <Suspense fallback={null}>
      <BoardView />
    </Suspense>
  );
}
