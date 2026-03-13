import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import { Portfolio } from '@/types/portfolio';

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('portfolio_data')
    .eq('username', username.toLowerCase())
    .eq('is_published', true)
    .single();

  if (!portfolio) {
    return { title: 'Portfolio Not Found' };
  }

  const data = portfolio.portfolio_data;
  
  return {
    title: `${data.name} - ${data.title}`,
    description: data.summary,
    openGraph: {
      title: `${data.name} - ${data.title}`,
      description: data.summary,
      type: 'profile',
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;

  const { data: portfolio, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('username', username.toLowerCase())
    .eq('is_published', true)
    .single();

  if (error || !portfolio) {
    notFound();
  }

  return <PortfolioTemplate data={(portfolio as Portfolio).portfolio_data} />;
}
