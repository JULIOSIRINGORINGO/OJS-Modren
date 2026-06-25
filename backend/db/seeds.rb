# Clear database
puts "Clearing database..."
Notification.destroy_all
Bookmark.destroy_all
Message.destroy_all
ReviewAssignment.destroy_all
Article.destroy_all
Category.destroy_all
Issue.destroy_all
User.destroy_all
Setting.destroy_all

# Create Settings
puts "Creating default settings..."
Setting.set("journal_name", "FAST-Journal UNPRI")
Setting.set("journal_abbr", "FASTJ")
Setting.set("journal_desc", "Platform modern untuk penerbitan akademik, tinjauan sejawat, dan diseminasi akses terbuka.")
Setting.set("issn_print", "2580-1234")
Setting.set("issn_online", "2580-5678")
Setting.set("current_volume", "12")
Setting.set("current_issue", "2")
Setting.set("editorial_email", "redaksi@fastjournal.id")
Setting.set("reviewers_per_manuscript", "2")
Setting.set("review_duration_days", "30")
Setting.set("doi_prefix", "10.31258")
Setting.set("doi_suffix_pattern", "fastjournal")

# Create Users
puts "Creating users..."
andi = User.create!(
  first_name: "Andi",
  last_name: "Prasetyo",
  email: "andi.prasetyo@ui.ac.id",
  password: "password123",
  institution: "Universitas Indonesia",
  role: "author"
)

dewi = User.create!(
  first_name: "Dewi",
  last_name: "Kusuma",
  email: "dewi.k@itb.ac.id",
  password: "password123",
  institution: "Institut Teknologi Bandung",
  role: "reviewer"
)

budi = User.create!(
  first_name: "Budi",
  last_name: "Santoso",
  email: "budi.s@ui.ac.id",
  password: "password123",
  institution: "Universitas Indonesia",
  role: "reviewer"
)

ahmad = User.create!(
  first_name: "Ahmad",
  last_name: "Yani",
  email: "ahmad.y@ugm.ac.id",
  password: "password123",
  institution: "Universitas Gadjah Mada",
  role: "reviewer"
)

hendra = User.create!(
  first_name: "Hendra",
  last_name: "Wijaya",
  email: "hendra@ugm.ac.id",
  password: "password123",
  institution: "Universitas Gadjah Mada",
  role: "editor"
)

# Create Categories
puts "Creating categories..."
sains_tek = Category.create!(name: "Sains dan Teknologi", slug: "sains-dan-teknologi", icon: "Brain")

# Create Issues
puts "Creating issues..."
issue_pub = Issue.create!(
  volume: "Vol. 12",
  number: "Edisi 1",
  year: 2025,
  title: "Inovasi Teknologi Digital & Pemrosesan Bahasa Alami",
  status: "published",
  published_at: "2025-04-01"
)

issue_draft = Issue.create!(
  volume: "Vol. 12",
  number: "Edisi 2",
  year: 2025,
  title: "Pembelajaran Mesin & Layanan Kesehatan Digital",
  status: "draft"
)

issue_old = Issue.create!(
  volume: "Vol. 11",
  number: "Edisi 2",
  year: 2024,
  title: "Sistem Terdistribusi & Optimasi Cloud",
  status: "published",
  published_at: "2024-10-15"
)

# Create Articles
puts "Creating articles..."
a1 = Article.create!(
  title: "Arsitektur Transformer untuk Tugas NLP Bahasa Indonesia dengan Sumber Daya Terbatas",
  abstract: "Makalah ini menyelidiki efektivitas model transformer pra-latih yang diadaptasi untuk tugas pemrosesan bahasa Indonesia dengan data berlabel yang terbatas...",
  authors: "Andi Prasetyo, Siti Rahayu, Budi Santoso",
  category: sains_tek,
  keywords: "NLP, Transformer, Bahasa Indonesia, Sumber Daya Terbatas",
  status: "Published",
  doi: "10.1234/ojs.2025.001",
  views: 1240,
  downloads: 342,
  issue_id: issue_pub.id,
  published_at: "2025-04-01",
  submitted_at: "2025-03-12",
  user: andi,
  file_name: "NLP_Paper_Andi_Prasetyo.docx",
  references: "1. Vaswani, A., et al. (2017). Attention is all you need. Advances in Neural Information Processing Systems.\n2. Devlin, J., et al. (2018). BERT: Pre-training of deep bidirectional transformers for language understanding.",
  body_text: <<~TEXT
    # 1. Pendahuluan
    Pemrosesan Bahasa Alami (NLP) dalam Bahasa Indonesia menghadapi hambatan besar berupa minimnya korpus teks terklasifikasi berskala besar. Makalah ini menguji keandalan model arsitektur Transformer pra-latih (pre-trained) yang disesuaikan (fine-tuned) untuk mengatasi keterbatasan dataset berlabel.

    # 2. Metodologi Penelitian
    Penelitian menggunakan model IndoBERT-base-uncased sebagai basis arsitektur. Kami menerapkan pemisahan data training/validation secara dinamis dan melakukan optimasi hiperparameter. Model dilatih dengan variasi jumlah korpus berlabel mulai dari 5% hingga 100% dari total dataset.

    # 3. Hasil & Pembahasan
    Hasil pengujian membuktikan bahwa model Transformer mampu mencapai akurasi sebesar 91.5% pada klasifikasi teks bahkan ketika hanya menggunakan 30% dari kapasitas data latih standar. Keberhasilan ini menegaskan efisiensi transfer learning untuk optimalisasi sistem NLP lokal.

    # 4. Kesimpulan & Saran
    Adaptasi arsitektur Transformer terbukti sangat efektif untuk pemrosesan teks Bahasa Indonesia dalam kondisi sumber daya berlabel terbatas. Pengembangan berikutnya disarankan mencakup perluasan korpus teks tidak terstruktur dari media sosial.
  TEXT
)

a2 = Article.create!(
  title: "Pembelajaran Federasi untuk Analitik Layanan Kesehatan yang Menjaga Privasi",
  abstract: "Kami mengusulkan kerangka pembelajaran federasi yang memungkinkan pelatihan model terdistribusi di jaringan rumah sakit tanpa berbagi data pasien mentah...",
  authors: "Dewi Kusuma, Reza Firmansyah",
  category: sains_tek,
  keywords: "Pembelajaran Federasi, Privasi, Layanan Kesehatan, Terdistribusi",
  status: "Under Review",
  submitted_at: "2025-04-05",
  user: dewi,
  file_name: "Federated_Learning_Dewi_K.docx",
  references: "1. McMahan, B., et al. (2017). Communication-efficient learning of deep networks from decentralized data.",
  body_text: <<~TEXT
    # 1. Pendahuluan
    Penerapan kecerdasan buatan di bidang kesehatan terkendala oleh kekhawatiran kebocoran privasi pasien. Pembelajaran Federasi (Federated Learning) menawarkan solusi revolusioner dengan melatih model secara terdistribusi di beberapa instansi medis tanpa perlu memusatkan data pasien mentah.

    # 2. Metodologi
    Kami merancang kerangka kerja dengan arsitektur jaringan LSTM federasi. Pengujian dilakukan secara terisolasi pada tiga server node rumah sakit. Konsensus bobot model global disinkronkan menggunakan algoritma optimasi FedAvg secara berkala.

    # 3. Hasil & Pembahasan
    Model LSTM federasi menunjukkan performa deteksi risiko klinis sebesar 94.2% AUC, hanya berselisih 0.5% dari model terpusat tradisional. Ini membuktikan kolaborasi antar-node dapat berjalan optimal dengan kerahasiaan privasi pasien terlindungi secara penuh.

    # 4. Kesimpulan & Saran
    Pembelajaran Federasi terbukti andal dalam menyelesaikan trade-off antara kebutuhan analitik kecerdasan buatan dan kepatuhan hukum regulasi data medis. Penelitian selanjutnya diharapkan dapat mengeksplorasi ketahanan model terhadap serangan peracunan data (data poisoning).
  TEXT
)

a3 = Article.create!(
  title: "Jaringan Saraf Graf untuk Prediksi Sitasi Akademik",
  abstract: "Studi ini mengeksplorasi pendekatan berbasis GNN untuk memprediksi tautan sitasi antara makalah akademik menggunakan metadata dan fitur teks...",
  authors: "Ahmad Fauzi, Lina Marlina, Hendra Wijaya",
  category: sains_tek,
  keywords: "GNN, Jaringan Sitasi, Graf Pengetahuan",
  status: "Published",
  doi: "10.1234/ojs.2025.002",
  views: 890,
  downloads: 201,
  issue_id: issue_pub.id,
  published_at: "2025-03-15",
  submitted_at: "2025-02-28",
  user: hendra,
  file_name: "GNN_Academic_Citation_Fauzi.docx",
  references: "1. Kipf, T. N., & Welling, M. (2016). Semi-supervised classification with graph convolutional networks.",
  body_text: <<~TEXT
    # 1. Pendahuluan
    Pertumbuhan literatur ilmiah yang cepat menuntut adanya metode otomatis untuk merekomendasikan referensi pustaka yang relevan. Jaringan Saraf Graf (Graph Neural Network - GNN) sangat cocok untuk menganalisis hubungan topologis antar-makalah dalam basis data grafik publikasi ilmiah.

    # 2. Metodologi
    Riset ini menggunakan representasi node embedding berbasis Graph Convolutional Network (GCN) untuk merepresentasikan fitur teks abstrak dan metadata penulis. Hubungan sitasi dimodelkan sebagai tugas prediksi tautan (link prediction) terarah pada graf.

    # 3. Hasil & Pembahasan
    Model GCN yang diusulkan mencapai akurasi prediksi F1-score sebesar 88.7% pada dataset sitasi Cora. Eksperimen membuktikan bahwa penggabungan fitur topologi grafik dan fitur semantik teks memberikan hasil rekomendasi yang jauh lebih relevan dibandingkan analisis teks konvensional.

    # 4. Kesimpulan & Saran
    GNN terbukti menjadi alat yang sangat tangguh untuk pemodelan struktur informasi akademik berskala besar. Saran riset lanjutan adalah penerapan graf heterogen untuk melibatkan relasi institusi dan kata kunci artikel.
  TEXT
)

a4 = Article.create!(
  title: "AI yang Dapat Dijelaskan dalam Penilaian Risiko Kredit: Tinjauan Sistematis",
  abstract: "Tinjauan komprehensif metode XAI yang diterapkan pada model penilaian kredit di lembaga keuangan Asia Tenggara...",
  authors: "Maria Puspita",
  category: sains_tek,
  keywords: "XAI, Risiko Kredit, SHAP, LIME",
  status: "Revision Required",
  submitted_at: "2025-04-18",
  user: andi,
  file_name: "XAI_Credit_Risk_Maria_P.docx",
  references: "1. Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions.",
  body_text: <<~TEXT
    # 1. Pendahuluan
    Industri perbankan mulai beralih menggunakan algoritma pembelajaran mesin untuk penilaian risiko kredit guna meningkatkan efisiensi kelayakan pinjaman. Namun, sifat kotak hitam (black-box) dari algoritma ini memicu masalah transparansi regulasi keuangan. Tinjauan ini fokus pada implementasi AI yang Dapat Dijelaskan (Explainable AI - XAI) untuk kepatuhan regulasi tersebut.

    # 2. Metodologi
    Kami melakukan studi komparasi sistematis terhadap implementasi metode SHAP (SHapley Additive exPlanations) dan LIME (Local Interpretable Model-agnostic Explanations) pada model klasifikasi XGBoost yang memproses data riwayat transaksi nasabah ritel.

    # 3. Hasil & Pembahasan
    Penelitian menunjukkan bahwa SHAP memberikan konsistensi interpretasi fitur global yang superior bagi analis risiko bank, sedangkan LIME terbukti lebih cepat dalam menyajikan alasan penolakan pinjaman secara lokal kepada nasabah. Integrasi XAI berhasil menaikkan tingkat kepercayaan pengambil keputusan perbankan terhadap otomasi AI.

    # 4. Kesimpulan & Saran
    Penerapan XAI krusial dalam mitigasi bias keputusan otomasi pada sistem finansial komersial. Disarankan bagi praktisi perbankan untuk mewajibkan modul penjelasan keputusan pada setiap deployment model risiko kredit baru.
  TEXT
)

a5 = Article.create!(
  title: "Analisis Sentimen Multimodal pada Media Sosial Indonesia",
  abstract: "Menggabungkan fitur teks, gambar, dan audio untuk analisis sentimen yang andal pada dataset Twitter dan Instagram Indonesia...",
  authors: "Rizki Hamdani, Yusuf Abdillah",
  category: sains_tek,
  keywords: "Multimodal, Analisis Sentimen, Media Sosial",
  status: "Under Review",
  submitted_at: "2025-05-01",
  user: andi,
  file_name: "Multimodal_Sentiment_SocialMedia.docx",
  references: "1. Soleymani, M., et al. (2017). A survey on multimodal sentiment analysis.",
  body_text: <<~TEXT
    # 1. Pendahuluan
    Opini masyarakat di media sosial kini tidak hanya diekspresikan lewat teks, melainkan lewat kombinasi gambar, meme, dan rekaman audio. Analisis sentimen unimodal (hanya teks) sering kali gagal mendeteksi sarkasme atau konteks emosional yang terkandung dalam kiriman visual.

    # 2. Metodologi
    Riset ini merancang arsitektur fusi awal (early fusion) multimodal. Kami menggunakan ResNet-50 untuk penarikan fitur gambar, model Wav2Vec untuk audio, dan model IndoBERT untuk interpretasi semantik teks. Seluruh representasi fitur disatukan dalam classifier akhir.

    # 3. Hasil & Pembahasan
    Penggabungan multimodal menaikkan skor akurasi sentimen sebesar 8.4% dibandingkan hanya menggunakan data teks saja. Sarkasme pada postingan Instagram berhasil didekonstruksi secara tepat dengan bantuan analisis visual gambar pendukung.

    # 4. Kesimpulan & Saran
    Multimodal fusi merupakan pendekatan yang mutlak diperlukan untuk analisis opini media sosial modern. Penelitian ke depan dapat diperluas menggunakan model fusi akhir (late fusion) untuk efisiensi beban komputasi.
  TEXT
)

a6 = Article.create!(
  title: "Optimasi Edge Computing untuk Aliran Data IoT Real-Time",
  abstract: "Kami menyajikan algoritma penjadwalan baru untuk node tepi yang memproses data sensor IoT frekuensi tinggi dengan batasan latensi...",
  authors: "Citra Dewi, Bagus Pramono, Indra Kusuma",
  category: sains_tek,
  keywords: "Edge Computing, IoT, Penjadwalan, Latensi",
  status: "Rejected",
  submitted_at: "2025-01-20",
  user: dewi,
  file_name: "Edge_Computing_Optimisation_IoT.docx",
  references: "1. Shi, W., et al. (2016). Edge computing: Vision and challenges.",
  body_text: <<~TEXT
    # 1. Pendahuluan
    Internet of Things (IoT) pada industri manufaktur menghasilkan data sensor dalam frekuensi sangat padat. Mengirim seluruh data sensor mentah ke pusat cloud server memicu bottleneck jaringan serta masalah latensi tanggap darurat yang tidak bisa ditoleransi.

    # 2. Metodologi
    Kami mengusulkan algoritma penjadwalan kompresi adaptif untuk node Edge Computing yang ditempatkan secara lokal dekat dengan sensor industri. Node Edge melakukan penyaringan data anomali sebelum data diteruskan ke cloud server pusat.

    # 3. Hasil & Pembahasan
    Eksperimen di lingkungan pabrik membuktikan metode kompresi adaptif mampu memangkas penggunaan bandwidth jaringan hingga 65% dan mempertahankan latensi respon di bawah 15ms. Penghematan daya pada server juga tercatat menurun sebesar 20%.

    # 4. Kesimpulan & Saran
    Optimalisasi di level Edge Computing terbukti vital untuk kesinambungan ekosistem IoT industri berskala besar. Saran penelitian lanjutan adalah penerapan pembelajaran penguatan (reinforcement learning) untuk otomasi kompresi data dinamis.
  TEXT
)

a7 = Article.create!(
  title: "Analisis Kinerja Protokol Konsensus pada Sistem Blockchain Terdistribusi",
  abstract: "Penelitian ini mengevaluasi dan membandingkan latensi, throughput, dan konsumsi energi dari berbagai protokol konsensus blockchain dalam skenario beban tinggi...",
  authors: "Andi Prasetyo, Budi Santoso",
  category: sains_tek,
  keywords: "Blockchain, Konsensus, Sistem Terdistribusi, Kinerja",
  status: "Published",
  doi: "10.1234/ojs.2024.003",
  views: 450,
  downloads: 95,
  issue_id: issue_old.id,
  published_at: "2024-10-15",
  submitted_at: "2024-09-01",
  user: andi,
  file_name: "Blockchain_Consensus_Performance.docx",
  references: "1. Castro, M., & Liskov, B. (2002). Practical Byzantine fault tolerance and proactive recovery.",
  body_text: <<~TEXT
    # 1. Pendahuluan
    Sistem blockchain terdistribusi mengandalkan protokol konsensus untuk menjamin integritas data tanpa otoritas pusat. Makalah ini menyajikan analisis kinerja mendalam dari beberapa algoritma konsensus.

    # 2. Metodologi
    Eksperimen dijalankan pada testnet privat dengan 10 node validator. Kami memvariasikan beban transaksi dan mengukur latensi serta throughput.

    # 3. Hasil & Pembahasan
    Hasil menunjukkan bahwa PBFT memberikan throughput tinggi pada jumlah node kecil, namun latensi meningkat secara eksponensial seiring bertambahnya validator.

    # 4. Kesimpulan
    Penelitian ini menyimpulkan bahwa pemilihan protokol konsensus harus disesuaikan dengan kebutuhan skalabilitas dan tingkat kepercayaan jaringan.
  TEXT
)

# Create Review Assignments
puts "Creating review assignments..."
ReviewAssignment.create!(
  article: a2,
  user: dewi,
  status: "pending"
)

ReviewAssignment.create!(
  article: a5,
  user: dewi,
  status: "pending"
)

ReviewAssignment.create!(
  article: a1,
  user: dewi,
  recommendation: "accept",
  comments: "Metodologi penulisan sangat baik, transformer diadaptasi dengan tepat untuk Bahasa Indonesia.",
  status: "completed"
)

# Create Bookmarks
puts "Creating bookmarks..."
Bookmark.create!(user: andi, article: a3)

# Create Messages
puts "Creating messages..."
Message.create!(
  sender: hendra,
  receiver: andi,
  subject: "Revisi Naskah: AI yang Dapat Dijelaskan",
  body: "Halo Andi, naskah Anda tentang 'AI yang Dapat Dijelaskan dalam Penilaian Risiko Kredit' memerlukan beberapa revisi minor pada bagian metode evaluasi. Silakan unggah revisi sebelum akhir minggu ini.",
  read: false
)

Message.create!(
  sender: andi,
  receiver: hendra,
  subject: "Pertanyaan mengenai Format Tabel",
  body: "Terima kasih Prof. Hendra atas masukannya. Saya ingin menanyakan apakah format tabel pada halaman 4 sudah sesuai dengan panduan atau harus disesuaikan kembali?",
  read: true
)

# Create Notifications
puts "Creating notifications..."

# Notifications for Reviewer (Dewi)
Notification.create!(
  user: dewi,
  kind: 'assignment',
  title: 'Penugasan Tinjauan Baru',
  body: "Naskah \"#{a2.title}\" memerlukan tinjauan Anda.",
  link: '/dashboard/reviews',
  metadata: { article_id: a2.id },
  read: false,
  created_at: 2.hours.ago
)
Notification.create!(
  user: dewi,
  kind: 'assignment',
  title: 'Penugasan Tinjauan Baru',
  body: "Naskah \"#{a5.title}\" memerlukan tinjauan Anda.",
  link: '/dashboard/reviews',
  metadata: { article_id: a5.id },
  read: false,
  created_at: 1.hour.ago
)
Notification.create!(
  user: dewi,
  kind: 'status_change',
  title: 'Status Naskah Berubah',
  body: "Naskah \"#{a6.title}\" telah ditolak oleh editor.",
  link: '/dashboard/submissions',
  metadata: { article_id: a6.id },
  read: true,
  created_at: 3.days.ago
)

# Notifications for Author (Andi)
Notification.create!(
  user: andi,
  kind: 'status_change',
  title: 'Status Naskah Berubah',
  body: "Naskah \"#{a4.title}\" berubah menjadi \"Revision Required\".",
  link: '/dashboard/submissions',
  metadata: { article_id: a4.id },
  read: false,
  created_at: 1.day.ago
)
Notification.create!(
  user: andi,
  kind: 'status_change',
  title: 'Naskah Diterbitkan!',
  body: "Selamat! Naskah \"#{a1.title}\" telah diterbitkan.",
  link: '/dashboard/submissions',
  metadata: { article_id: a1.id },
  read: true,
  created_at: 5.days.ago
)

# Notifications for Editor (Hendra)
Notification.create!(
  user: hendra,
  kind: 'assignment',
  title: 'Naskah Baru Masuk',
  body: "Naskah baru berjudul \"#{a5.title}\" telah dikirim oleh Andi Prasetyo.",
  link: '/admin/submissions',
  metadata: { article_id: a5.id },
  read: false,
  created_at: 30.minutes.ago
)
Notification.create!(
  user: hendra,
  kind: 'assignment',
  title: 'Naskah Baru Masuk',
  body: "Naskah baru berjudul \"#{a2.title}\" telah dikirim oleh Dewi Kusuma.",
  link: '/admin/submissions',
  metadata: { article_id: a2.id },
  read: true,
  created_at: 2.days.ago
)

puts "Database seeded successfully!"
