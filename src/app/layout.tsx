import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
      <body className={`${roboto.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
