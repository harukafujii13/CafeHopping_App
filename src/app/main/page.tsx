import { Navbar } from '@/components/nav.component';
import CafeFinder from '@/components/cafeFinder.component';
import { Footer } from '@/components/footer.component';

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
