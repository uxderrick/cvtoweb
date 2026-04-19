import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const CATEGORIES: Record<string, string> = {
  bug:     'Bug report',
  feature: 'Feature request',
  general: 'General feedback',
  other:   'Other',
};

export async function POST(request: NextRequest) {
  try {
    const { category, message, email } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const categoryLabel = CATEGORIES[category] ?? 'General feedback';
    const replyTo       = email?.trim() || null;

    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

    if (resend) {
      await resend.emails.send({
        from:       'CVtoWeb Feedback <cvtoweb@uxderrick.com>',
        to:         'carlyneket@gmail.com',
        replyTo:    replyTo ?? undefined,
        subject:    `[${categoryLabel}] New feedback — CVtoWeb`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;">
            <h2 style="margin:0 0 8px;font-size:20px;color:#111;">New Feedback</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">Submitted via cvtoweb.com/feedback</p>

            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
              <tr>
                <td style="padding:10px 12px;background:#f5f5f5;font-weight:600;color:#374151;width:110px;border-radius:6px 0 0 0;">Category</td>
                <td style="padding:10px 12px;color:#111;background:#fafafa;">${categoryLabel}</td>
              </tr>
              ${replyTo ? `
              <tr>
                <td style="padding:10px 12px;background:#f5f5f5;font-weight:600;color:#374151;">Reply to</td>
                <td style="padding:10px 12px;color:#111;background:#fafafa;">${replyTo}</td>
              </tr>` : ''}
            </table>

            <div style="background:#f9f9f9;border-left:3px solid #6d73d2;padding:16px 20px;border-radius:0 6px 6px 0;">
              <p style="margin:0;font-size:15px;color:#1f2937;line-height:1.7;white-space:pre-wrap;">${message.trim()}</p>
            </div>
          </div>
        `,
      });
    } else {
      // Dev fallback — log to console
      console.log('[Feedback]', { category: categoryLabel, message: message.trim(), replyTo });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Feedback error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
