import { Navbar } from '@/components/navbar/nav.component';
import CafeFinder from '@/components/cafeFinder/cafefinder.component';
import { Footer } from '@/components/footer/footer.component';

export default function MainPage() {
  return (
    <div className="flex flex-col min-h-screen bg-light-green">
      <Navbar />
      <div className="flex-grow">
        <CafeFinder />
      </div>
      <Footer />
    </div>
  );
}
