import Googlemap from '@/components/googlemap.component';
import { Navbar } from '@/components/nav.component';

export default function MainPage() {
  return (
    <div className="h-[100vh] bg-light-green">
      <Navbar />
      <Googlemap />
    </div>
  );
}
