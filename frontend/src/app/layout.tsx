import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
// SITE_TAGLINE adalah "Sistem Jurnal Terbuka — Dirancang Ulang"

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && (event.reason instanceof Event || event.reason.toString() === '[object Event]')) {
                  event.preventDefault();
                  console.warn('Suppressed unhandled rejection of type Event:', event.reason);
                }
              });
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
