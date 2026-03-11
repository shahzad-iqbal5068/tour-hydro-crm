import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hydro CRM",
  description: "Hydro CRM dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white px-4 py-6 text-sm text-zinc-700 shadow-sm md:flex">
            <div className="mb-8 text-lg font-semibold text-zinc-900">
              Hydro CRM
            </div>
            <nav className="space-y-2">
              <a
                href="/"
                className="block rounded-md px-3 py-2 hover:bg-zinc-100"
              >
                Home
              </a>
              <a
                href="/form"
                className="block rounded-md px-3 py-2 hover:bg-zinc-100"
              >
                Form Page
              </a>
              <a
                href="/table"
                className="block rounded-md px-3 py-2 hover:bg-zinc-100"
              >
                Table Page
              </a>
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex min-h-screen flex-1 flex-col">
            {/* Navbar */}
            <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm">
              <div className="md:hidden font-semibold">Hydro CRM</div>
              <div className="flex-1 md:flex md:items-center md:justify-end">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                  Dummy Navbar
                </span>
              </div>
            </header>

            {/* Page body */}
            <main className="flex-1 bg-zinc-50 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
