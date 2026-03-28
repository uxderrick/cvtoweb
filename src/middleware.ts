import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Normalize hostname: lowercase, trim, and remove port
  const host = (request.headers.get('host') || '').toLowerCase().trim();
  const hostname = host.split(':')[0];
  const url = request.nextUrl.clone();
  
  // Extract subdomain
  let subdomain: string | null = null;
  
  // Get the app domain from environment or default
  const appDomain = (process.env.NEXT_PUBLIC_APP_DOMAIN || 'cvtoweb.com').toLowerCase().trim().split(':')[0];
  
  // Detection flags
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isAppDomain = hostname === appDomain;
  const isVercelDomain = hostname.includes('vercel.app') || hostname.includes('vercel.dev');

  console.log(`[Middleware] Host: ${hostname} | AppDomain: ${appDomain} | isApp: ${isAppDomain} | isVercel: ${isVercelDomain}`);

  // NUCLEAR OPTION: If this is the main app domain OR a Vercel system domain, 
  // we do NOT do any subdomain processing. It's the home base.
  if (isAppDomain || isVercelDomain) {
    subdomain = null;
  } else if (isLocalhost) {
    // Only extract subdomain on localhost if it's specifically prefixed (e.g. user.localhost:3000)
    const parts = host.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== 'www') {
      subdomain = parts[0];
    }
  } else {
    // For Production Custom Domains: (e.g. carlyne.yourdomain.com)
    const parts = hostname.split('.');
    if (parts.length > 1) {
      // If we are on some-subdomain.custom-domain.com
      // The subdomain is the first part
      const firstPart = parts[0];
      if (firstPart !== 'www' && hostname !== appDomain) {
        subdomain = firstPart;
      }
    }
  }

  console.log(`[Middleware] Final Subdomain: ${subdomain || 'NONE'}`);
  
  // If we have a subdomain, rewrite to portfolio page
  if (subdomain) {
    // Don't rewrite API routes or static files
    if (
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/favicon') ||
      url.pathname.includes('.')
    ) {
      return NextResponse.next();
    }
    
    console.log(`[Middleware] REWRITING to: /portfolio/${subdomain}${url.pathname}`);
    
    url.pathname = `/portfolio/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
