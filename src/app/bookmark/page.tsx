import { Navbar } from '@/components/navbar/nav.component';
import { Footer } from '@/components/footer/footer.component';
import BookmarkPage from './bookmarkCafe';

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
