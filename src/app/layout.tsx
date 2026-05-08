import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "BS-CAR | Car Management System",
  description: "Advanced Car Management System with Inventory, Sales, and Installments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km">
      <body className="antialiased">
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
