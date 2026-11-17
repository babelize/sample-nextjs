import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';

export const metadata: Metadata = {
  title: "Tasklane: the to-do list for small teams",
  description: "Plan the week, share tasks and see what is due, in one simple list.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><Suspense><NextIntlClientProvider>{children}</NextIntlClientProvider></Suspense></body>
    </html>
  );
}
