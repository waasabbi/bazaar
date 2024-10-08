import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/topBar";
import { ToasterProvider } from "@/lib/TosterProvider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UrbanBazaar - Admin Dashboard",
  description: "Admin dashboard to manage UrbanBazaar data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToasterProvider />
          <div className="flex max-lg:flex-col text-white">
            <LeftSideBar />
            <div className="flex-1">{children}</div>
            <TopBar />
          </div>

        </body>
      </html>
    </ClerkProvider>
  );
}