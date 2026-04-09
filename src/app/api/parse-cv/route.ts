import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import mammoth from 'mammoth';
import { parseCV } from '@/lib/parse-cv';
import { supabaseAdmin } from '@/lib/supabase';
import { validatePortfolioData } from '@/lib/validation';
import { generateEditToken } from '@/lib/edit-token';

// Returns true if the extracted text has enough CV/resume signals.
// Requires at least 3 distinct category hits to pass.
function looksLikeCV(text: string): boolean {
  const t = text.toLowerCase();
  const categories = [
    // Work history
    ['experience', 'work history', 'employment history', 'work experience', 'professional experience'],
    // Education
    ['education', 'university', 'college', 'bachelor', 'master', 'mba', 'phd', 'degree', 'diploma'],
    // Skills / competencies
    ['skills', 'competencies', 'technologies', 'proficiencies', 'expertise', 'tools'],
    // Professional identity
    ['resume', 'curriculum vitae', ' cv ', 'objective', 'summary', 'profile', 'about me'],
    // Contact / links
    ['email', 'phone', 'linkedin', 'github', 'portfolio', 'contact'],
    // Job markers
    ['role', 'position', 'job title', 'responsibilities', 'achievements', 'accomplishments', 'projects'],
    // Dates pattern common in CVs (e.g. "Jan 2020 – Present", "2018 - 2021")
    ['present', 'current', '20', '19'], // crude year signal
  ];

  let hits = 0;
  for (const group of categories) {
    if (group.some((kw) => t.includes(kw))) hits++;
  }
  return hits >= 3;
}

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

    const isPdf = file.type === 'application/pdf';
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || file.name.toLowerCase().endsWith('.docx');

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { error: 'Please upload a PDF or Word document (.pdf or .docx)' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let cvText = '';

    if (isPdf) {
      // Extract text and annotations from PDF using pdfjs-dist
      const uint8Array = new Uint8Array(buffer);
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array, useSystemFonts: true });
      const pdfDocument = await loadingTask.promise;
      const extractedUrls = new Set<string>();

      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);

        const textContent = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        cvText += pageText + '\n';

        try {
          const annotations = await page.getAnnotations();
          for (const annotation of annotations) {
            if (annotation.subtype === 'Link') {
              const url = annotation.url || annotation.unsafeUrl || (annotation.action && (annotation.action.url || annotation.action.URI));
              if (url && typeof url === 'string' && url.startsWith('http')) {
                extractedUrls.add(url);
              }
            }
          }
        } catch (e) {
          console.warn('Could not extract annotations for page', i, e);
        }
      }

      // Fallback: regex URL extraction from text
      const textUrls = cvText.match(/https?:\/\/[^\s)]+/g);
      if (textUrls) textUrls.forEach(url => extractedUrls.add(url));

      if (extractedUrls.size > 0) {
        cvText += '\n\n--- Links Extracted from Document ---\n';
        Array.from(extractedUrls).forEach(url => { cvText += `- ${url}\n`; });
      }
    } else {
      // Extract text from DOCX using mammoth
      const result = await mammoth.extractRawText({ buffer });
      cvText = result.value;

      // Also pull any URLs from the text
      const textUrls = cvText.match(/https?:\/\/[^\s)]+/g);
      if (textUrls) {
        const unique = Array.from(new Set(textUrls));
        cvText += '\n\n--- Links Extracted from Document ---\n';
        unique.forEach(url => { cvText += `- ${url}\n`; });
      }
    }

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Please ensure the PDF contains selectable text.' },
        { status: 400 }
      );
    }

    // Heuristic CV/resume detection — reject obvious non-CVs before hitting the AI
    if (!looksLikeCV(cvText)) {
      return NextResponse.json(
        {
          error: 'This document does not appear to be a CV or resume. Please upload a CV or resume PDF.',
          code: 'NOT_A_CV',
        },
        { status: 422 }
      );
    }

    // Parse CV with AI
    const portfolioData = await parseCV(cvText);

    // AI second-gate: if AI determined this isn't a CV, surface a clean error
    if ('error' in portfolioData && (portfolioData as { error: string }).error === 'not_a_cv') {
      return NextResponse.json(
        {
          error: 'This document does not appear to be a CV or resume. Please upload a CV or resume PDF.',
          code: 'NOT_A_CV',
        },
        { status: 422 }
      );
    }

    const validation = validatePortfolioData(portfolioData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: `Parsed CV data is invalid: ${validation.error}` },
        { status: 422 }
      );
    }

    // Create a temporary portfolio entry (not published yet)
    const { data: portfolio, error } = await supabaseAdmin
      .from('portfolios')
      .insert({
        portfolio_data: validation.data,
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
      editToken: generateEditToken(portfolio.id),
      data: validation.data,
    });

  } catch (error) {
    console.error('Parse CV error:', error);
    return NextResponse.json(
      { error: 'Failed to parse CV' },
      { status: 500 }
    );
  }
}
