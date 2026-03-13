import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { Portfolio } from '@/types/portfolio';
import PreviewClient from './PreviewClient';

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params in Next.js 15+
  const { id } = await params;
  
  // Fetch portfolio using server-side admin client (bypasses RLS)
  const { data: portfolio, error } = await supabaseAdmin
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !portfolio) {
    notFound();
  }

  return <PreviewClient portfolio={portfolio as Portfolio} />;
}
