import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "../contexts/ProjectContext";
import Sidebar from "../components/Sidebar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RJ Piscicultura - Simulador Industrial",
  description: "Simulador técnico e financeiro para Piscicultura Industrial em BH.",
  manifest: "manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.className} bg-[#060913] text-gray-100 antialiased min-h-screen flex`}>
        <ProjectProvider>
          <Sidebar />
          <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
            {children}
          </main>
        </ProjectProvider>
      </body>
    </html>
  );
}
