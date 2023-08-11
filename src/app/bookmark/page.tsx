import { Navbar } from '@/components/nav.component';
import BookmarkPage from './form';

export default function Bookmark() {
  return (
    <div className="h-[100vh] bg-light-green">
      <Navbar />
      <BookmarkPage />
    </div>
  );
}
