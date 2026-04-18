import { NextResponse } from 'next/server';
import { emailTemplate } from '@/lib/email';

export async function GET() {
  const html = emailTemplate(
    'https://johndoe.cvtoweb.com',
    'https://cvtoweb.com/edit/preview-token-123',
    'http://localhost:3000'
  );

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
