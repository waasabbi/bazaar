import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ToasterProvider } from "@/lib/TosterProvider";
import { ClerkProvider } from "@clerk/nextjs";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UrbanBazaar - Admin Dashboard",
  description: "Admin dashboard to manage UrbanBazaar data",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-white text-gray-800`}>
          <ToasterProvider />
          <AdminPanelLayout>
            <div className="flex min-h-screen max-lg:flex-col">
              <main className="flex-1 p-6 bg-white shadow-md border border-gray-300 rounded-lg">
                {children}
              </main>
            </div>
          </AdminPanelLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
