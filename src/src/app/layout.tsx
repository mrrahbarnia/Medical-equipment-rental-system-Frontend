import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MessageProvider } from "@/contexts/messageProvider";
import { AuthProvider } from "@/contexts/authProvider";
import { ReactQueryProvider } from "@/contexts/reactQueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rentsho",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <link rel="icon" href="/images/Logo.png" sizes="any" />
        <ReactQueryProvider>
          <AuthProvider>
            <MessageProvider>
              <Header />
                {children}
              <Footer />
            </MessageProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
