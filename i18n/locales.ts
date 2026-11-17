// @babelize-generated locale list
// Babelize regenerates this file while the line above is present.
export const sourceLocale = "en";
export const locales = ["en","es","de","fr","ja","pt"] as string[];

const rightToLeft = [] as string[];

/** `dir` for <html>: right-to-left scripts (Arabic, Hebrew, Persian, Urdu…). */
export function localeDirection(locale: string): 'rtl' | 'ltr' {
  return rightToLeft.includes(locale) ? 'rtl' : 'ltr';
}
