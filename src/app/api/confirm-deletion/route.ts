import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Find portfolio with this token
    const { data: portfolio, error } = await supabaseAdmin
      .from('portfolios')
      .select('id, username, deletion_token_expires_at')
      .eq('deletion_token', token)
      .single();

    if (error || !portfolio) {
      return NextResponse.json(
        { error: 'Invalid or already used token' },
        { status: 404 }
      );
    }

    // Check expiry
    if (new Date(portfolio.deletion_token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This deletion link has expired. Please submit a new request.' },
        { status: 410 }
      );
    }

    // Delete the portfolio
    const { error: deleteError } = await supabaseAdmin
      .from('portfolios')
      .delete()
      .eq('id', portfolio.id);

    if (deleteError) {
      console.error('Deletion error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 });
    }

    return NextResponse.json({ success: true, username: portfolio.username });

  } catch (err) {
    console.error('Confirm deletion error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
