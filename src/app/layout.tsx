import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "HSK Learning App by Duc",
  description: "Hệ thống luyện tập HSK chuyên nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-[#B89A67]/30 selection:text-[#B89A67]",
          inter.variable,
          playfair.variable
        )}
      >
        <SidebarProvider>
          <div className="flex min-h-screen">
            <MainSidebar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
