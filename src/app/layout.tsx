import type { Metadata } from "next";
import "./globals.css";
import { PlantProvider } from "@/context/PlantContext";

export const metadata: Metadata = {
  title: "PlantTwin — Digital Plant Intelligence Dashboard",
  description:
    "Track your real plant with a digital twin. Monitor growth stages, health scores, and get AI-powered care insights. PlantTwin makes plant care smarter.",
  keywords: ["plant care", "digital twin", "plant health", "garden tracker", "smart gardening"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <PlantProvider>
          {children}
        </PlantProvider>
      </body>
    </html>
  );
}
