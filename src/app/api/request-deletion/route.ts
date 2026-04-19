import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

const BASE_URL = process.env.NEXT_PUBLIC_APP_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`
  : 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const { username, email } = await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail    = email.trim().toLowerCase();

    // Look up portfolio by username
    const { data: portfolio, error } = await supabaseAdmin
      .from('portfolios')
      .select('id, email, username')
      .eq('username', normalizedUsername)
      .eq('is_published', true)
      .single();

    // Always respond with success to prevent username enumeration
    if (error || !portfolio) {
      return NextResponse.json({ success: true });
    }

    // Verify email matches
    if (portfolio.email?.toLowerCase() !== normalizedEmail) {
      return NextResponse.json({ success: true });
    }

    // Generate a secure one-time token
    const token   = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Store the token
    await supabaseAdmin
      .from('portfolios')
      .update({
        deletion_token:            token,
        deletion_token_expires_at: expires,
      })
      .eq('id', portfolio.id);

    // Send confirmation email
    const confirmUrl = `${BASE_URL}/delete/confirm?token=${token}`;
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

    if (resend) {
      await resend.emails.send({
        from:    'CVtoWeb <cvtoweb@uxderrick.com>',
        to:      normalizedEmail,
        subject: 'Confirm your portfolio deletion — CVtoWeb',
        html:    deletionEmailTemplate(portfolio.username, confirmUrl),
      });
    } else {
      console.log('Deletion confirm URL:', confirmUrl);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Request deletion error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

function deletionEmailTemplate(username: string, confirmUrl: string): string {
  const BASE_IMG = process.env.NEXT_PUBLIC_APP_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : 'http://localhost:3000';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Portfolio Deletion</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="font-family:'Source Sans 3',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">

  <div style="padding:56px 48px 40px;">

    <!-- Logo -->
    <div style="margin-bottom:32px;">
      <img src="${BASE_IMG}/email-logo-mark.svg" width="28" height="17" alt="" style="vertical-align:middle;margin-right:8px;border:0;" />
      <span style="font-size:26px;font-weight:600;color:#1e1e1e;vertical-align:middle;letter-spacing:-0.01em;">cv<span style="color:#6d73d2;">to</span>web</span>
    </div>

    <div style="text-align:center;">
      <h1 style="font-size:28px;font-weight:600;color:#111827;line-height:1.4;margin:0 0 16px;">
        Confirm portfolio deletion
      </h1>

      <div style="font-size:16px;font-weight:500;color:#374151;line-height:1.6;max-width:400px;margin:0 auto 28px;">
        <p style="margin:0 0 8px;">We received a request to permanently delete the portfolio at:</p>
        <p style="margin:0 0 16px;font-weight:700;color:#111827;">${username}.cvtoweb.com</p>
        <p style="margin:0;">This action cannot be undone. Click below to confirm.</p>
      </div>

      <a href="${confirmUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:100px;font-size:16px;font-family:'Source Sans 3',Arial,sans-serif;font-weight:600;letter-spacing:0.01em;">
        Yes, delete my portfolio
      </a>

      <p style="margin-top:24px;font-size:14px;color:#9ca3af;">
        This link expires in 24 hours. If you didn't request this, ignore this email — your portfolio is safe.
      </p>
    </div>
  </div>

  <div style="background:#f5f5f5;padding:24px 48px;">
    <p style="font-size:14px;color:#6b7280;margin:0;line-height:1.5;">
      Sent by CVtoWeb · If you have questions, contact <a href="mailto:carlyneket@gmail.com" style="color:#4d48bf;">carlyneket@gmail.com</a>
    </p>
  </div>

</div>
</body>
</html>`;
}
