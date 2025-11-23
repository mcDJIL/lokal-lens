import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "LokalLens - Platform Budaya Indonesia",
  description: "Platform digital untuk melestarikan dan berbagi kekayaan budaya Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <AuthProvider>
          <Suspense fallback={
            <div className="w-full bg-white min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1A36F]"></div>
            </div>
          }>
            <MainLayout>{children}</MainLayout>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
