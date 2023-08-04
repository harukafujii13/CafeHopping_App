import { Navbar } from '@/components/nav.component';
import Bookmarks from './form';

export default function Bookmark() {
  return (
    <div className="h-[100vh] bg-light-green">
      <Navbar />
      <p>Bookmark page</p>
      <Bookmarks userId={'2e0db5ee-8d45-44e5-b712-4d070d3d5529'} />
    </div>
  );
}
