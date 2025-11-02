import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { SiteBanners } from '@/components/layout/site-banners';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteBanners />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

    