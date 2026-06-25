"use client";

import { BookOpen } from "lucide-react";
import { PublishedArticlesGallery } from "@/components/dashboard/PublishedArticlesGallery";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

export default function ArticlesDashboardPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title="Artikel Terbit"
        subtitle="Jelajahi seluruh karya ilmiah yang telah diterbitkan di FAST-Journal."
        icon={BookOpen}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          <PublishedArticlesGallery />
        </div>
      </div>
    </div>
  );
}
