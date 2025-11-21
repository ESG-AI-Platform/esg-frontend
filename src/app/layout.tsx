import type { ReactNode } from "react";

import type { Metadata, Viewport } from "next";

import { NavBar } from "@/shared/components";
import { AuthProvider } from "@/shared/providers/AuthProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "ESG Frontend",
  description: "ESG Management Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="pt-16">
        <AuthProvider>
          <NavBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
