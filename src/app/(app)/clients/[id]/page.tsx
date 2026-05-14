import { ClientOverview } from '@/components/views/ClientOverview';

type Params = { id: string };

export default async function ClientPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  return <ClientOverview clientId={id} />;
}
