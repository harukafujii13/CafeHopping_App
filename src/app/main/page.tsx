import { Navbar } from '@/components/nav.component';
import CafeFinder from '@/components/cafeFinder.component';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-light-green">
      <Navbar />
      <CafeFinder />
    </div>
  );
}
