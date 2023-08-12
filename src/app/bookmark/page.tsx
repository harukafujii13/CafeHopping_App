import { Navbar } from '@/components/nav.component';
import { Footer } from '@/components/footer.component';
import BookmarkPage from './form';

export default function Bookmark() {
  return (
    <div className="flex flex-col bg-light-green min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <BookmarkPage />
      </div>
      <Footer />
    </div>
  );
}
