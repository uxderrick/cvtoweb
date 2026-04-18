import { Resend } from 'resend';
import { getPortfolioUrl, getLiveEditUrl } from './urls';

const BASE_URL = process.env.NEXT_PUBLIC_APP_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`
  : 'https://cvtoweb.com';

export function emailTemplate(portfolioUrl: string, editUrl: string, baseUrl = BASE_URL): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Portfolio is Live!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
    .mascot { width: 140px; height: auto; }
    @media only screen and (max-width: 480px) {
      .mascot { width: 90px !important; }
    }
    @media only screen and (min-width: 481px) and (max-width: 768px) {
      .mascot { width: 115px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="font-family:'Source Sans 3',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">

  <!-- ── Header ── -->
  <div style="padding:56px 48px 40px;">

    <!-- Logo -->
    <div style="margin-bottom:32px;">
      <img src="${BASE_URL}/email-logo-mark.svg" width="28" height="17" alt="" style="vertical-align:middle;margin-right:8px;border:0;" />
      <span style="font-size:26px;font-weight:600;color:#1e1e1e;vertical-align:middle;letter-spacing:-0.01em;">cv<span style="color:#6d73d2;">to</span>web</span>
    </div>

    <!-- Centre content -->
    <div style="text-align:center;">

      <!-- Success mascot -->
      <div style="margin-bottom:28px;">
        <img src="${BASE_URL}/email-mascot.svg" class="mascot" alt="Success" style="border:0;display:inline-block;" />
      </div>

      <!-- Title -->
      <h1 style="font-size:32px;font-weight:600;color:#111827;line-height:1.5;margin:0 0 16px;">
        Your portfolio is officially live!
      </h1>

      <!-- Body -->
      <div style="font-size:16px;font-weight:500;color:#374151;line-height:1.5;max-width:372px;margin:0 auto 28px;">
        <p style="margin:0 0 4px;">Hi there,</p>
        <p style="margin:0;">Congratulations on publishing your new portfolio! Click below to view and share it:</p>
      </div>

      <!-- CTA button -->
      <a href="${portfolioUrl}" style="display:inline-block;background:#5c5dcb;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:100px;font-size:16px;font-family:'Source Sans 3',Arial,sans-serif;font-weight:600;letter-spacing:0.01em;">
        View my Portfolio
      </a>

    </div>
  </div>

  <!-- ── Footer ── -->
  <div style="background:#f5f5f5;padding:28px 48px 40px;">
    <p style="font-size:16px;margin:0 0 8px;line-height:1.5;">
      <strong style="font-weight:700;color:#111827;">Need to make changes?</strong>
    </p>
    <p style="font-size:16px;font-weight:400;color:#374151;line-height:1.5;margin:0 0 28px;">
      Update your portfolio anytime with your private edit link. Save it somewhere secure!
    </p>
    <a href="${editUrl}" style="font-size:16px;font-weight:500;color:#4d48bf;text-decoration:underline;">
      Edit my portfolio
    </a>
  </div>

</div>
</body>
</html>`;
}

export async function sendWelcomeEmail(
  email: string,
  username: string,
  portfolioId: string,
  editToken: string
) {
  const portfolioUrl = getPortfolioUrl(username);
  const editUrl = getLiveEditUrl(portfolioId, editToken);

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY is not set. Simulating welcome email send:');
    console.log(`To: ${email}`);
    console.log(`Public URL: ${portfolioUrl}`);
    console.log(`Edit URL: ${editUrl}`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'CVtoWeb <cvtoweb@uxderrick.com>',
      to: email,
      subject: '🎉 Your Portfolio is Live!',
      html: emailTemplate(portfolioUrl, editUrl),
    });

    if (error) {
      console.error('Resend API returned an error:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}
