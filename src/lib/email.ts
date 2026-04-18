import { Resend } from 'resend';
import { getPortfolioUrl, getLiveEditUrl } from './urls';

export function emailTemplate(portfolioUrl: string, editUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Portfolio is Live!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
    /* Mascot responsive sizing */
    .mascot { width: 140px; height: 140px; }
    @media only screen and (max-width: 480px) {
      .mascot { width: 90px !important; height: 90px !important; }
    }
    @media only screen and (min-width: 481px) and (max-width: 768px) {
      .mascot { width: 115px !important; height: 115px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="font-family:'Source Sans 3',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">

  <!-- ── Header ── -->
  <div style="padding:56px 48px 40px;">

    <!-- Logo -->
    <div style="margin-bottom:32px;">
      <svg width="28" height="17" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:8px;">
        <circle cx="1.63636" cy="1.63636" r="1.63636" fill="#6D73D2"/>
        <rect x="4.09094" width="12.9091" height="3.27273" rx="1.63636" fill="#6D73D2"/>
        <rect y="5.72729" width="12.9091" height="3.27273" rx="1.63636" fill="#6D73D2"/>
        <circle cx="15.3637" cy="7.36366" r="1.63636" fill="#6D73D2"/>
      </svg>
      <span style="font-size:26px;font-weight:600;color:#1e1e1e;vertical-align:middle;letter-spacing:-0.01em;">cv<span style="color:#6d73d2;">to</span>web</span>
    </div>

    <!-- Centre content -->
    <div style="text-align:center;">

      <!-- Success mascot (static SVG — no CSS vars, no animation) -->
      <div style="margin-bottom:28px;">
        <svg class="mascot" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="mg" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#A7F3D0"/>
              <stop offset="100%" stop-color="#059669"/>
            </radialGradient>
          </defs>
          <!-- Orb -->
          <ellipse cx="50" cy="54" rx="34" ry="32" fill="url(#mg)"/>
          <!-- Shine -->
          <ellipse cx="40" cy="40" rx="14" ry="10" fill="white" opacity="0.18" transform="rotate(-15 40 40)"/>
          <!-- Antenna -->
          <circle cx="50" cy="17" r="2.4" fill="white" opacity="0.75"/>
          <path d="M50 22 Q50 18 52 14" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6"/>
          <!-- Face: arch eyes -->
          <path d="M35 52 Q40 47 45 52" stroke="#064E3B" stroke-width="2.8" stroke-linecap="round" fill="none"/>
          <path d="M55 52 Q60 47 65 52" stroke="#064E3B" stroke-width="2.8" stroke-linecap="round" fill="none"/>
          <!-- Smile -->
          <path d="M40 59 Q50 69 60 59" stroke="#064E3B" stroke-width="2.3" stroke-linecap="round" fill="none"/>
          <!-- Blush -->
          <ellipse cx="50" cy="63" rx="5.2" ry="2.6" fill="#F472B6" opacity="0.7"/>
          <circle cx="33" cy="57" r="4.2" fill="#A7F3D0" opacity="0.45"/>
          <circle cx="67" cy="57" r="4.2" fill="#A7F3D0" opacity="0.45"/>
          <!-- Check badge (top-right of orb) -->
          <circle cx="78" cy="23" r="11" fill="white"/>
          <circle cx="78" cy="23" r="9" fill="white" stroke="#059669" stroke-width="2"/>
          <path d="M73 23 L77 27 L84 17" stroke="#059669" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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
  <div style="background:#f5f5f5;padding:28px 48px 40px;min-height:165px;position:relative;">
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
