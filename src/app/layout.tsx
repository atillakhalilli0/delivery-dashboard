import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "FleetFlow — Delivery Operations",
  description: "Delivery logistics management platform for dispatch, fleet, and analytics teams.",
};

const NO_FLASH_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem('fleetflow-theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
