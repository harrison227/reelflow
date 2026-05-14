import { CARDS } from '@/lib/mock-data';
import { PreviewPage } from '@/components/views/PreviewPage';
import { notFound } from 'next/navigation';

type Params = { token: string };

export default async function PreviewRoute({ params }: { params: Promise<Params> }) {
  const { token } = await params;
  // For demo: token is the card id. Real app: token maps to a card via signed URL.
  const card = CARDS.find((c) => c.id === token) ?? CARDS.find((c) => c.id === 'V-241');
  if (!card) notFound();
  return <PreviewPage card={card} />;
}
