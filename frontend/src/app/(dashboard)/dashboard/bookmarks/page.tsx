import { Bookmark } from "lucide-react";
import { BookmarkGallery } from "@/components/dashboard/BookmarkGallery";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

export const metadata = { title: "Penanda" };

export default function BookmarksPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title="Penanda"
        subtitle="Artikel yang Anda tandai untuk dibaca nanti."
        icon={Bookmark}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          <BookmarkGallery />
        </div>
      </div>
    </div>
  );
}
