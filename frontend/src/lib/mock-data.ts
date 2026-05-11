import type { Article, Author, Category } from "@/types";

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Arsitektur Transformer untuk Tugas NLP Bahasa Indonesia dengan Sumber Daya Terbatas",
    abstract:
      "Makalah ini menyelidiki efektivitas model transformer pra-latih yang diadaptasi untuk tugas pemrosesan bahasa Indonesia dengan data berlabel yang terbatas...",
    authors: ["Andi Prasetyo", "Siti Rahayu", "Budi Santoso"],
    category: "Pemrosesan Bahasa Alami",
    keywords: ["NLP", "Transformer", "Bahasa Indonesia", "Sumber Daya Terbatas"],
    submittedAt: "2025-03-12",
    publishedAt: "2025-04-01",
    status: "Published",
    doi: "10.1234/ojs.2025.001",
    views: 1240,
    downloads: 342,
    issue: "Edisi 1",
    volume: "Vol. 12",
  },
  {
    id: "2",
    title: "Pembelajaran Federasi untuk Analitik Layanan Kesehatan yang Menjaga Privasi",
    abstract:
      "Kami mengusulkan kerangka pembelajaran federasi yang memungkinkan pelatihan model terdistribusi di jaringan rumah sakit tanpa berbagi data pasien mentah...",
    authors: ["Dewi Kusuma", "Reza Firmansyah"],
    category: "Pembelajaran Mesin",
    keywords: ["Pembelajaran Federasi", "Privasi", "Layanan Kesehatan", "Terdistribusi"],
    submittedAt: "2025-04-05",
    status: "Under Review",
    issue: "Edisi 2",
    volume: "Vol. 12",
  },
  {
    id: "3",
    title: "Jaringan Saraf Graf untuk Prediksi Sitasi Akademik",
    abstract:
      "Studi ini mengeksplorasi pendekatan berbasis GNN untuk memprediksi tautan sitasi antara makalah akademik menggunakan metadata dan fitur teks...",
    authors: ["Ahmad Fauzi", "Lina Marlina", "Hendra Wijaya"],
    category: "Ilmu Data",
    keywords: ["GNN", "Jaringan Sitasi", "Graf Pengetahuan"],
    submittedAt: "2025-02-28",
    publishedAt: "2025-03-15",
    status: "Published",
    doi: "10.1234/ojs.2025.002",
    views: 890,
    downloads: 201,
    issue: "Edisi 1",
    volume: "Vol. 12",
  },
  {
    id: "4",
    title: "AI yang Dapat Dijelaskan dalam Penilaian Risiko Kredit: Tinjauan Sistematis",
    abstract:
      "Tinjauan komprehensif metode XAI yang diterapkan pada model penilaian kredit di lembaga keuangan Asia Tenggara...",
    authors: ["Maria Puspita"],
    category: "AI yang Dapat Dijelaskan",
    keywords: ["XAI", "Risiko Kredit", "SHAP", "LIME"],
    submittedAt: "2025-04-18",
    status: "Revision Required",
  },
  {
    id: "5",
    title: "Analisis Sentimen Multimodal pada Media Sosial Indonesia",
    abstract:
      "Menggabungkan fitur teks, gambar, dan audio untuk analisis sentimen yang andal pada dataset Twitter dan Instagram Indonesia...",
    authors: ["Rizki Hamdani", "Yusuf Abdillah"],
    category: "Pemrosesan Bahasa Alami",
    keywords: ["Multimodal", "Analisis Sentimen", "Media Sosial"],
    submittedAt: "2025-05-01",
    status: "Under Review",
  },
  {
    id: "6",
    title: "Optimasi Edge Computing untuk Aliran Data IoT Real-Time",
    abstract:
      "Kami menyajikan algoritma penjadwalan baru untuk node tepi yang memproses data sensor IoT frekuensi tinggi dengan batasan latensi...",
    authors: ["Citra Dewi", "Bagus Pramono", "Indra Kusuma"],
    category: "Sistem Terdistribusi",
    keywords: ["Edge Computing", "IoT", "Penjadwalan", "Latensi"],
    submittedAt: "2025-01-20",
    status: "Rejected",
  },
];

export const mockCategories: Category[] = [
  { id: "1", name: "Ilmu Data", slug: "ilmu-data", icon: "BarChart3", count: 48 },
  { id: "2", name: "Pemrosesan Bahasa Alami", slug: "pba", icon: "MessageSquare", count: 35 },
  { id: "3", name: "Pembelajaran Mesin", slug: "pembelajaran-mesin", icon: "Brain", count: 62 },
  { id: "4", name: "Penglihatan Komputer", slug: "penglihatan-komputer", icon: "Eye", count: 29 },
  { id: "5", name: "Sistem Terdistribusi", slug: "sistem-terdistribusi", icon: "Network", count: 21 },
  { id: "6", name: "AI yang Dapat Dijelaskan", slug: "xai", icon: "Lightbulb", count: 17 },
];

export const mockAuthors: Author[] = [
  {
    id: "1",
    name: "Andi Prasetyo",
    email: "andi.prasetyo@ui.ac.id",
    institution: "Universitas Indonesia",
    role: "Author",
    articleCount: 5,
    joinedAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Dewi Kusuma",
    email: "dewi.k@itb.ac.id",
    institution: "Institut Teknologi Bandung",
    role: "Reviewer",
    articleCount: 3,
    joinedAt: "2022-08-22",
  },
  {
    id: "3",
    name: "Prof. Hendra Wijaya",
    email: "hendra@ugm.ac.id",
    institution: "Universitas Gadjah Mada",
    role: "Editor",
    articleCount: 12,
    joinedAt: "2021-03-10",
  },
];
