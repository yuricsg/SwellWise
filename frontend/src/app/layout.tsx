import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'SwellWise - Inteligência Artificial para Praias',
  description:
    'Descubra o melhor do litoral brasileiro com análise de IA. Condições do mar, temperatura, ondas e muito mais em tempo real.',
  keywords: ['praias', 'ondas', 'surf', 'brasil', 'inteligência artificial'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
