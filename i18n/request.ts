// @babelize-generated next-intl request config
// Babelize regenerates this file (to update the locale list) while the line
// above is present. Remove that line to take it over.
import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { locales, sourceLocale } from './locales';

export { locales, sourceLocale };

type Messages = { [key: string]: string | Messages };

async function load(locale: string): Promise<Messages> {
  return (await import(`../public/locales/${locale}.json`)).default;
}

/** `base` with `over` on top, key by key: a string a locale doesn't have yet shows the source text. */
function withFallback(base: Messages, over: Messages): Messages {
  const merged: Messages = { ...base };
  for (const [key, value] of Object.entries(over)) {
    const fallback = base[key];
    merged[key] = typeof value === 'object' && typeof fallback === 'object' ? withFallback(fallback, value) : value;
  }
  return merged;
}

async function messagesFor(locale: string) {
  const source = await load(sourceLocale);
  return locale === sourceLocale ? source : withFallback(source, await load(locale));
}

function pickLocale(candidates: Array<string | undefined>): string {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const wanted = candidate.toLowerCase();
    const exact = locales.find((l) => l.toLowerCase() === wanted);
    if (exact) return exact;
    const base = locales.find((l) => l.split('-')[0].toLowerCase() === wanted.split('-')[0]);
    if (base) return base;
  }
  return sourceLocale;
}

export default getRequestConfig(async () => {
  const requestHeaders = await headers();
  // The URL's language (/ja/…), from the locale proxy.
  const routed = requestHeaders.get('x-babelize-locale');
  if (routed && locales.includes(routed)) return { locale: routed, messages: await messagesFor(routed) };
  // Otherwise the NEXT_LOCALE cookie, then the browser's Accept-Language.
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  const acceptLanguage = (requestHeaders.get('accept-language') ?? '')
    .split(',')
    .map((part) => part.split(';')[0].trim());
  const locale = pickLocale([cookieLocale, ...acceptLanguage]);
  return { locale, messages: await messagesFor(locale) };
});
