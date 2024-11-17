"use client";

import { grazProvider } from "@abstract-money/provider-graz";
import { AbstractProvider, createConfig } from "@abstract-money/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter, Poppins } from "next/font/google";
import { cn } from "@/utils";
import { Toaster } from "@/components/ui/toaster";
import { GrazProvider } from "@/app/_providers/graz";
import { AccountProvider } from "@/app/_providers/accountProvider";
import "./globals.css";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
      networkMode: "offlineFirst",
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      networkMode: "offlineFirst",
    },
  },
});

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900", "800", "700"],
  variable: "--font-display",
});

const abstractConfig = createConfig({
  provider: grazProvider,
  apiUrl:
    process.env.NEXT_PUBLIC_ABSTRACT_API_URL ||
    "https://api-hackmos-2024.up.railway.app/",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        className={cn(
          inter.variable,
          poppins.variable,
          "h-full w-full bg-white"
        )}
      >
        <QueryClientProvider client={client}>
          <GrazProvider client={client}>
            <AbstractProvider config={abstractConfig}>
              <AccountProvider>{children}</AccountProvider>
            </AbstractProvider>
          </GrazProvider>
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  );
}
