import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { portfolioId, portfolioData } = await request.json();

    if (!portfolioId || !portfolioData) {
      return NextResponse.json(
        { error: 'Missing required fields: portfolioId, portfolioData' },
        { status: 400 }
      );
    }

    // Update the portfolio data in Supabase
    const { error } = await supabaseAdmin
      .from('portfolios')
      .update({
        portfolio_data: portfolioData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', portfolioId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update portfolio' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}
