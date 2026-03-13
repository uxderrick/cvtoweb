import { NextRequest, NextResponse } from 'next/server';
import { parseCV } from '@/lib/parse-cv';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF using pdf-parse (debug-disabled version to avoid ENOENT errors)
    const pdfParse = (await import('pdf-parse-debugging-disabled')).default;
    const pdfData = await pdfParse(buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Please ensure the PDF contains selectable text.' },
        { status: 400 }
      );
    }

    // Parse CV with Claude
    const portfolioData = await parseCV(cvText);

    // Create a temporary portfolio entry (not published yet)
    const { data: portfolio, error } = await supabaseAdmin
      .from('portfolios')
      .insert({
        portfolio_data: portfolioData,
        template: 'default',
        is_published: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save portfolio' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      portfolioId: portfolio.id,
      data: portfolioData,
    });

  } catch (error) {
    console.error('Parse CV error:', error);
    return NextResponse.json(
      { error: 'Failed to parse CV' },
      { status: 500 }
    );
  }
}
