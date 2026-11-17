// @babelize-generated locale routing
// Babelize regenerates this file while the line above is present. Remove that
// line to take it over (keep the x-babelize-locale header and the matcher).
import { NextResponse, type NextRequest } from 'next/server';
import { locales, sourceLocale } from './i18n/locales';

const ONE_YEAR = 60 * 60 * 24 * 365;

function localized(pathname: string, locale: string) {
  if (locale === sourceLocale) return pathname;
  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}

/** hreflang alternates for search engines, as an HTTP Link header. */
function alternates(request: NextRequest, pathname: string) {
  const origin = request.nextUrl.origin;
  const links = locales.map((l) => `<${origin}${localized(pathname, l)}>; rel="alternate"; hreflang="${l}"`);
  links.push(`<${origin}${pathname}>; rel="alternate"; hreflang="x-default"`);
  return links.join(', ');
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first = '', ...rest] = pathname.split('/');
  const prefixed = locales.find((l) => l !== sourceLocale && l.toLowerCase() === first.toLowerCase());

  if (prefixed) {
    // /ja/docs is app/docs, in Japanese.
    const url = request.nextUrl.clone();
    url.pathname = `/${rest.join('/')}`;
    const headers = new Headers(request.headers);
    headers.set('x-babelize-locale', prefixed);
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.cookies.set('NEXT_LOCALE', prefixed, { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' });
    response.headers.set('Link', alternates(request, url.pathname));
    return response;
  }

  // An unprefixed URL is the source language, unless the visitor chose another.
  const chosen = request.cookies.get('NEXT_LOCALE')?.value;
  if (chosen && chosen !== sourceLocale && locales.includes(chosen)) {
    const url = request.nextUrl.clone();
    url.pathname = localized(pathname, chosen);
    return NextResponse.redirect(url);
  }

  const headers = new Headers(request.headers);
  headers.set('x-babelize-locale', sourceLocale);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Link', alternates(request, pathname));
  return response;
}

export const config = {
  // Pages only: not API routes, Next.js internals or files (anything with a dot).
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
