import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"], // Specify the weights you need
  variable: "--font-poppins", // Define a CSS variable for the font
  display: "swap", // Optional: improves performance
});

export const metadata: Metadata = {
  title: "Full Refresh Auth Client",
  description: "Full Refresh Auth Client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
