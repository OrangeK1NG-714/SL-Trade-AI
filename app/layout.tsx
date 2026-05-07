import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicLayout from "@/components/PublicLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SL Trade - Premium Plastic Raw Materials for Africa",
  description:
    "Your trusted supplier of PP, PE, PVC, ABS, PET and PS plastic raw materials. Competitive pricing, reliable logistics, and 24/7 support for African markets.",
  keywords:
    "plastic raw materials, PP, PE, PVC, ABS, PET, PS, Africa, Nigeria, Kenya, Ghana, polypropylene, polyethylene",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
