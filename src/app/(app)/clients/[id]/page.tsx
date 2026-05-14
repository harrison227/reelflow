import { redirect } from 'next/navigation';

type Params = { id: string };

// A client opens straight into the board, scoped to just their videos.
export default async function ClientPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  redirect(`/?scope=${id}`);
}
